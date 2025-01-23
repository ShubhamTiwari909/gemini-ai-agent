"use client";
import React, { useRef, useState } from "react";
import FormControls from "./FormControls";
import ResponseRenderer from "./ResponseRenderer";
import { Session } from "next-auth";
import { useGlobalStore } from "@/store/global-store";

const GeminiAiWrapper = ({
  user,
  expressUrl,
}: {
  user: Session["user"];
  expressUrl: string;
}) => {
  // State to store the summary text generated by the Gemini AI model
  const [summary, setSummary] = useState("");

  // State to indicate if the summarization process is currently loading
  const [loading, setLoading] = useState(false);

  // Reference to the DOM element that will display the summary
  const summaryRef = useRef<HTMLDivElement>(null);

  // Retrieve the local history of prompts and responses from the global store
  const localHistory = useGlobalStore((state) => state.history);

  // Function to update the local history in the global store
  const updateLocalHistory = useGlobalStore((state) => state.updateHistory);

  // State to store the input prompt text
  const [prompt, setPrompt] = useState("");

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const addHistoryToDb = async (
    data: { summary: string },
    input: string,
    filePreview?: string,
  ) => {
    // Generate a unique history ID from input and summary
    const historyId = `${input.split(" ").join("-").slice(0, 10)}-${data.summary.split(" ").join("-").slice(0, 10)}-${user?.email}`;

    // Save the prompt and its response to the server-side history
    await fetch(`${expressUrl}/history/add`, {
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

    // Update the local history state
    updateLocalHistory([
      ...localHistory,
      {
        historyId: historyId,
        email: user?.email || "",
        prompt: input,
        response: data.summary,
        filePreview: filePreview || "",
      },
    ]);

    // Set the current prompt
    setPrompt(input);
  };

  /**
   * Handles the summarization of input text by interacting with the Gemini AI model.
   * It updates the summary state and logs the history of prompts and responses.
   *
   * @param input - The input text to be summarized.
   */
  const handleSummarize = async (input: string) => {
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
        addHistoryToDb(data, input);
        // Update the summary state with the response
        setSummary(data.summary);
      }
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

  const handleImageResponse = async () => {
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
          addHistoryToDb(data, file.name, fileDataUrl);
          // Update the summary state with the response
          setSummary(data.summary);
        }
      }
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

  return (
    <div>
      <FormControls
        handleSummarize={handleSummarize}
        loading={loading}
        file={file}
        setFile={setFile}
        handleImageResponse={handleImageResponse}
        className="mb-20"
      />
      <ResponseRenderer
        filePreview={filePreview}
        prompt={prompt}
        summaryRef={summaryRef}
        summary={summary}
        loading={loading}
      />
    </div>
  );
};

export default GeminiAiWrapper;
