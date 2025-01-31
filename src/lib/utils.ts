import {
  AddHistoryToDB,
  HandleImageResponse,
  HandleSummarize,
} from "@/types/response-handlers";

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
export const handleSummarize = async (handleSummarize: HandleSummarize) => {
  const { input, setLoading, setSummary, summaryRef, setFileName } =
    handleSummarize;
  setLoading(true);
  try {
    // Send POST request to the Gemini AI model API with input text
    const response = await fetch("/api/gemini-model", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: input }),
    });

    // Parse the response data
    const data = await response.json();
    if (data) {
      // Update the summary state with the response
      setSummary(data.summary);
      setFileName("");
    }
    return data;
  } catch (error) {
    console.error("Error summarizing content:", error);
    setSummary("An error occurred while summarizing.");
  } finally {
    setLoading(false);
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
export const handleImageResponse = async (
  handleImageResponse: HandleImageResponse,
) => {
  const {
    setLoading,
    file,
    setFilePreview,
    setFile,
    setSummary,
    summaryRef,
    setFileName,
  } = handleImageResponse;
  setLoading(true);
  try {
    if (file) {
      const fileBase64 = await new Promise((resolve, reject) => {
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

      const fileDataUrl = `data:${file.type};base64,${fileBase64}`;
      setFilePreview(fileDataUrl);

      // Send POST request to the Gemini AI model API with input text
      const response = await fetch("/api/gemini-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: fileBase64,
          mimeType: file.type,
          demo: "hello",
        }),
      });
      // Parse the response data
      const data = await response.json();
      if (data) {
        // Update the summary state with the response
        setSummary(data.summary);
        setFileName("");
      }
      return data;
    }
    return null;
  } catch (error) {
    console.error("Error summarizing content:", error);
    setSummary("An error occurred while summarizing.");
  } finally {
    setLoading(false);
    // Scroll the summary into view smoothly
    summaryRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setFile(null);
  }
};

export const addHistoryToDb = async (addHistoryToDb: AddHistoryToDB) => {
  const {
    data,
    input,
    updateLocalHistory,
    localHistory,
    expressUrl,
    setPrompt,
    user,
    filePreview,
  } = addHistoryToDb;
  // Generate a unique history ID from input and summary
  const historyId = `${input.split(" ").join("-").slice(0, 10)}-${data.summary.split(" ").join("-").slice(0, 10)}-${user?.email}/${Date.now()}`;
  // Save the prompt and its response to the server-side history
  const result = await fetch(`${expressUrl}/history/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: input,
      response: data.summary,
      filePreview: filePreview || "",
      email: user?.email,
      historyId: historyId,
    }),
  });
  const response = await result.json();

  // Update the local history state
  updateLocalHistory([
    {
      _id: response.newHistory._id,
      historyId: historyId,
      email: user?.email || "",
      prompt: input,
      response: data.summary,
      filePreview: filePreview || "",
    },
    ...localHistory,
  ]);

  // Set the current prompt
  setPrompt(input);
};
