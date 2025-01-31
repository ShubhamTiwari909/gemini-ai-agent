"use client";
import React, { useRef, useState } from "react";
import FormControls from "./FormControls";
import ResponseRenderer from "./ResponseRenderer";
import { Session } from "next-auth";
import { useGlobalStore } from "@/store/global-store";
import {
  handleImageResponse,
  handleSummarize,
  addHistoryToDb,
} from "@/lib/utils";

const GeminiAiWrapper = ({
  user,
  expressUrl,
}: {
  user: Session["user"];
  expressUrl: string;
}) => {
  // REFS
  // Reference to the DOM element that will display the summary
  const summaryRef = useRef<HTMLDivElement>(null);

  // GLOBAL STATES
  // Retrieve the local history of prompts and responses from the global store
  const localHistory = useGlobalStore((state) => state.history);

  // Function to update the local history in the global store
  const updateLocalHistory = useGlobalStore((state) => state.updateHistory);

  // Update the fileName state in the global store
  const setFileName = useGlobalStore((state) => state.setFileName);

  /**
   * The current summary in the global store.
   * This state is updated when the Gemini AI model returns a response.
   */
  const summary = useGlobalStore((state) => state.summary);

  // Update the summary state in the global store
  const setSummary = useGlobalStore((state) => state.setSummary);

  // Retrieve the loading state from the global store
  const loading = useGlobalStore((state) => state.loading);

  // Update the loading state in the global store
  const setLoading = useGlobalStore((state) => state.setLoading);

  // LOCAL STATES
  // State to store the input prompt text
  const [prompt, setPrompt] = useState("");

  //State to store the input file
  const [file, setFile] = useState<File | null>(null);

  // State to store the input file preview
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleSummarizeFromAi = async (input: string) => {
    await handleSummarize({
      input,
      setLoading,
      setSummary,
      summaryRef,
      setFileName,
    })
      .then((data) => {
        addHistoryToDb({
          data,
          input,
          user,
          expressUrl,
          setPrompt,
          updateLocalHistory,
          localHistory,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleImageResponseFromAi = async () => {
    await handleImageResponse({
      setLoading,
      file,
      setFilePreview,
      setFile,
      setSummary,
      summaryRef,
      setFileName,
    })
      .then((data) => {
        addHistoryToDb({
          data,
          input: file?.name || "",
          user,
          expressUrl,
          setPrompt,
          updateLocalHistory,
          localHistory,
          filePreview,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <FormControls
        handleSummarize={handleSummarizeFromAi}
        file={file}
        setFile={setFile}
        handleImageResponse={handleImageResponseFromAi}
        className="lg:mb-20"
      />
      <ResponseRenderer
        summary={summary}
        loading={loading}
        filePreview={filePreview}
        prompt={prompt}
        summaryRef={summaryRef}
      />
    </div>
  );
};

export default GeminiAiWrapper;
