import {
  AddPostsToDB,
  HandleImageResponse,
  HandleSummarize,
} from "@/types/response-handlers";
import { notFound } from "next/navigation";

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
export const handleSummarize = (
  handleSummarize: HandleSummarize,
): Promise<string> => {
  const { input, csrfToken } = handleSummarize;
  return fetch("/api/gemini-model", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: input, csrfToken }),
  })
    .then((response) => response.json())
    .then((data) => {
      return data.summary;
    })
    .catch((error) => {
      console.error("Error summarizing content:", error);
      return Promise.reject(error);
    });
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
  const { file, csrfToken, base64String } = handleImageResponse;
  // Send POST request to the Gemini AI model API with input text
  return fetch("/api/gemini-image", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      image: base64String,
      mimeType: file?.type,
      csrfToken,
    }),
  }).then((response) => {
    return response.json();
  });
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

    const postBody = {
      user: { ...user, userId },
      prompt: input,
      response: data,
      responseType: generateImageTag ? "image" : "text",
      filePreview: filePreview,
      postId,
      tags,
      toggle: {
        comments: true,
        downloads: true,
      },
    };
    // Save the prompt and its response to the server-side post
    fetch(`${expressUrl}/posts/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiAuthToken}`,
      },
      body: JSON.stringify(postBody),
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
            toggle: {
              comments: false,
              downloads: false,
            },
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

export const fetchUserId = async (userId: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPRESS_API_URL}/users/findById`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
        },
        body: JSON.stringify({ userId }),
      },
    );
    const data = await response.json();
    if (data.error) {
      notFound();
    }
    return data;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
};

export const fetchUserByEmail = async (email: string) => {
  try {
    const response = await fetch(
      `${process.env.EXPRESS_API_URL}/users/findUserByEmail`,
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
    if (data.error) {
      notFound();
    }
    return data;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
};

export async function downloadImage(src: string, prompt?: string) {
  const response = await fetch(src as string, {
    mode: "cors",
  });
  const blob = await response.blob();
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = `${prompt}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export const compactNumberFormat = (number: number) => {
  return new Intl.NumberFormat("en-US", {
    notation: "compact",
    compactDisplay: "short",
  }).format(number);
};

export const copyLinkToClipboard = (link: string) => {
  navigator.clipboard.writeText(link);
};
