import {
  AddHistoryToDB,
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
 *   - addHistoryToDb: A function to add the history to the database
 */
export const handleSummarize = (handleSummarize: HandleSummarize) => {
  const {
    input,
    summaryRef,
    csrfToken,
    user,
    expressUrl,
    localHistory,
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
    updateLocalHistory,
  } = handleSummarize;
  try {
    setLoading(true);
    setSummary("");
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
        if (response) {
          // Update the summary state with the response
          setSummary(response.summary);
          setFileName("");
          setTags([]);
          setLoading(false);
          setInputText("");
          addHistoryToDb({
            data: response.summary,
            input,
            user,
            expressUrl,
            setPrompt,
            updateLocalHistory,
            localHistory,
            apiAuthToken,
            userId,
            tags,
            generateImageTag,
          });
        }
        return response;
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
    localHistory,
    apiAuthToken,
    userId,
    tags,
    generateImageTag,
    setPrompt,
    updateLocalHistory,
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
              if (response) {
                // Update the summary state with the response
                setSummary(response.summary);
                setFileName("");
                setTags([]);
                setLoading(false);
                setFile(null);
                addHistoryToDb({
                  data: response?.summary,
                  input: file?.name || "",
                  user,
                  expressUrl,
                  setPrompt,
                  updateLocalHistory,
                  localHistory,
                  filePreview: fileDataUrl,
                  apiAuthToken,
                  userId,
                  tags,
                  generateImageTag,
                });
              }
              return {
                response,
                filePreview: fileDataUrl,
              };
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

export const addHistoryToDb = (addHistoryToDb: AddHistoryToDB) => {
  try {
    const {
      data,
      input,
      updateLocalHistory,
      localHistory,
      expressUrl,
      setPrompt,
      user,
      filePreview,
      apiAuthToken,
      userId,
      tags,
      generateImageTag,
    } = addHistoryToDb;

    // Generate a unique history ID from input and summary
    const historyId = `${input.split(" ").join("-").slice(0, 10)}-${data.split(" ").join("-").slice(0, 10)}-${user?.email}/${Date.now()}`;
    // Save the prompt and its response to the server-side history
    fetch(`${expressUrl}/history/add`, {
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
        historyId: historyId,
        tags,
      }),
    })
      .then((response) => {
        return response.json();
      })
      .then((response) => {
        // Update the local history state
        updateLocalHistory([
          {
            user: { ...user, userId },
            _id: response.newHistory._id,
            historyId: historyId,
            prompt: input,
            response: data,
            filePreview: filePreview || "",
            tags,
            responseType: generateImageTag ? "image" : "text",
            likes: response.newHistory.likes,
          },
          ...localHistory,
        ]);
        // Set the current prompt
        setPrompt(input);
      });
  } catch (error) {
    console.error("Error adding history to database:", error);
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
