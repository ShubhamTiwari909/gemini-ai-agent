import {
  AddPostsToDB,
  HandleImageResponse,
  HandleSummarize,
} from "@/types/response-handlers";
import { decrypt } from "./hybrid-encryption";

export const formatDate = (dateString: string) => {
  const timestamp = Date.parse(dateString); // Returns milliseconds since epoch
  const date = new Date(timestamp);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

export const base64ToText = (base64Data: string) => {
  // Remove the "data:text/html;base64," prefix
  const base64String = base64Data.split(",")[1];

  // Decode Base64 to plain text
  const decodedText = atob(base64String);

  return decodedText;
};

/**
 * Handles summarizing content using the Gemini AI model.
 *
 * @param {HandleSummarize} handleSummarize - An object with the following properties:
 *   - input: The text to summarize
 *   - setLoading: A function to set the loading state
 *   - setSummary: A function to set the summary state
 *   - summaryRef: A React ref to the summary element
 *   - setFileName: A function to set the file name state
 *   - addPostsToDb: A function to add the post to the database
 */
export const handleSummarize = (handleSummarize: HandleSummarize) => {
  const {
    input,
    summaryRef,
    csrfToken,
    user,
    expressUrl,
    localPosts,
    apiAuthToken,
    userId,
    tags,
    generateImageTag,
    setPrompt,
    setLoading,
    setSummary,
    setFileName,
    setTags,
    setInputText,
    updateLocalPosts,
    setGenerateImageTag,
  } = handleSummarize;
  try {
    setLoading(true);
    setSummary("");

    const resetStates = () => {
      setFileName("");
      setTags([]);
      setLoading(false);
      setInputText("");
      setGenerateImageTag(false);
    };
    // Send POST request to the Gemini AI model API with input text
    fetch("/api/gemini-model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input, csrfToken }),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        // Parse the response data
        if (response && response.summary.name !== "ServerError") {
          // Update the summary state with the response
          setSummary(response.summary);
          resetStates();
          addPostToDb({
            data: response.summary,
            input,
            user,
            expressUrl,
            setPrompt,
            updateLocalPosts,
            localPosts,
            apiAuthToken,
            userId,
            tags,
            generateImageTag,
          });
          return response;
        }
        if (response.summary.name === "ServerError") {
          setSummary("An error occurred while summarizing.");
          resetStates();
        }
      })
      .catch((error) => {
        console.error("Error summarizing content:", error);
        setSummary("An error occurred while summarizing.");
      });
  } catch (error) {
    console.error("Error summarizing content:", error);
    setSummary("An error occurred while summarizing.");
  } finally {
    // Scroll the summary into view smoothly
    summaryRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

/**
 * Handles the response from the Gemini AI model API when generating content
 * from an image.
 *
 * @param {HandleImageResponse} handleImageResponse - The object containing the
 * properties to update the component state.
 * @returns {Promise<void>} - A promise that resolves when the summary has been
 * updated.
 */
export const handleImageResponse = (
  handleImageResponse: HandleImageResponse,
) => {
  const {
    file,
    summaryRef,
    csrfToken,
    language,
    user,
    expressUrl,
    localPosts,
    apiAuthToken,
    userId,
    tags,
    generateImageTag,
    setPrompt,
    updateLocalPosts,
    setLoading,
    setFilePreview,
    setFile,
    setSummary,
    setFileName,
    setTags,
  } = handleImageResponse;
  try {
    setLoading(true);
    setSummary("");
    setFilePreview(null);

    const resetStates = () => {
      setFileName("");
      setTags([]);
      setLoading(false);
      setFile(null);
    };
    if (file) {
      const fileBase64 = new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === "string") {
            resolve(reader.result.split(",")[1]); // Extract Base64 string
          } else {
            reject(new Error("Invalid file format"));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      fileBase64.then((base64String) => {
        if (base64String) {
          const fileDataUrl = `data:${file.type};base64,${base64String}`;
          setFilePreview(fileDataUrl);

          // Send POST request to the Gemini AI model API with input text
          fetch("/api/gemini-image", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              image: base64String,
              mimeType: file.type,
              csrfToken,
              language,
            }),
          })
            .then((response) => {
              return response.json();
            })
            .then((response) => {
              if (response && response.summary.name !== "ServerError") {
                // Update the summary state with the response
                setSummary(response.summary);
                resetStates();
                addPostToDb({
                  data: response?.summary,
                  input: file?.name || "",
                  user,
                  expressUrl,
                  setPrompt,
                  updateLocalPosts,
                  localPosts,
                  filePreview: fileDataUrl,
                  apiAuthToken,
                  userId,
                  tags,
                  generateImageTag,
                });
                return {
                  response,
                  filePreview: fileDataUrl,
                };
              }
            });
        }
      });
    }
    return null;
  } catch (error) {
    console.error("Error summarizing content:", error);
    setSummary("An error occurred while summarizing.");
    return null;
  } finally {
    // Scroll the summary into view smoothly
    summaryRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }
};

export const addPostToDb = (addPostToDb: AddPostsToDB) => {
  try {
    const {
      data,
      input,
      updateLocalPosts,
      localPosts,
      expressUrl,
      setPrompt,
      user,
      filePreview,
      apiAuthToken,
      userId,
      tags,
      generateImageTag,
    } = addPostToDb;

    // Generate a unique post ID from input and summary
    const postId = `${input.split(" ").join("-").slice(0, 10)}-${data.split(" ").join("-").slice(0, 10)}-${user?.email}/${Date.now()}`;
    // Save the prompt and its response to the server-side post
    fetch(`${expressUrl}/posts/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiAuthToken}`,
      },
      body: JSON.stringify({
        user: { ...user, userId },
        prompt: input,
        response: data,
        responseType: generateImageTag ? "image" : "text",
        filePreview: filePreview || "",
        postId,
        tags,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        // Update the local posts state
        updateLocalPosts([
          {
            user: { ...user, userId },
            _id: response.newPost._id,
            postId,
            prompt: input,
            response: data,
            filePreview: filePreview || "",
            tags,
            responseType: generateImageTag ? "image" : "text",
            likes: response.newPost.likes,
            views: response.newPost.views,
            comments: response.newPost.comments,
          },
          ...localPosts,
        ]);
        // Set the current prompt
        setPrompt(input);
      });
  } catch (error) {
    console.error("Error adding posts to database:", error);
  }
};

export const fetchUserId = async (email: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPRESS_API_URL}/users/findById`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
        },
        body: JSON.stringify({ email }),
      },
    );
    const data = await response.json();
    return decrypt(data.uid);
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
};
