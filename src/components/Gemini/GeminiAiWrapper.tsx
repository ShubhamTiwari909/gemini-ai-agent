"use client";
import React, { useRef } from "react";
import FormControls from "./FormControls";
import ResponseRenderer, { childClasses } from "./ResponseRenderer";
import { Session } from "next-auth";
import { useGlobalStore } from "@/store/global-store";
import {
  handleImageResponse,
  handleSummarize,
  addHistoryToDb,
} from "@/lib/utils";
import { TourProvider } from "@reactour/tour";

const steps = [
  {
    selector: ".voice-input",
    content: "Mic button to add the prompt with voice input",
  },
  {
    selector: ".textarea-input",
    content: "Input field to write down your prompt to generate content",
  },
  {
    selector: ".tags-dropdown",
    content: "Select a tag for your post",
  },
  {
    selector: ".sample-dropdown",
    content: "Select a sample prompt to get started",
  },
  {
    selector: ".language-dropdown",
    content: "Select a language to generate the response in that language",
  },
  {
    selector: ".generate-button",
    content: "Generate your response based on the prompt or image",
  },
  {
    selector: ".image-upload-input",
    content: "Upload an image to generate a description and captions for it",
  },
];

const GeminiAiWrapper = ({
  user,
  expressUrl,
  apiAuthToken,
  userId,
}: {
  user: Session["user"];
  expressUrl: string;
  apiAuthToken: string;
  userId: string;
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

  const language = useGlobalStore((state) => state.language);

  // LOCAL STATES
  // State to store the input prompt text
  const prompt = useGlobalStore((state) => state.prompt);
  const setPrompt = useGlobalStore((state) => state.setPrompt);

  //State to store the input file
  const file = useGlobalStore((state) => state.file);
  const setFile = useGlobalStore((state) => state.setFile);

  // State to store the input file preview
  const filePreview = useGlobalStore((state) => state.filePreview);
  const setFilePreview = useGlobalStore((state) => state.setFilePreview);

  const tags = useGlobalStore((state) => state.tags);
  const setTags = useGlobalStore((state) => state.setTags);

  const handleSummarizeFromAi = async (input: string) => {
    const response = await fetch("/api/csrf");
    const token = await response.json();

    if (token) {
      const csrfToken = token.csrfToken;
      await handleSummarize({
        input,
        setLoading,
        setSummary,
        summaryRef,
        setFileName,
        csrfToken,
        setTags,
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
            apiAuthToken,
            userId,
            tags,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.error("Failed to fetch CSRF token:");
    }
  };

  const handleImageResponseFromAi = async () => {
    try {
      const response = await fetch("/api/csrf");
      const token = await response.json();

      if (token) {
        const csrfToken = token.csrfToken;
        await handleImageResponse({
          setLoading,
          file,
          setFilePreview,
          setFile,
          setSummary,
          summaryRef,
          setFileName,
          csrfToken,
          language,
          setTags,
        })
          .then((data) => {
            addHistoryToDb({
              data: data?.data,
              input: file?.name || "",
              user,
              expressUrl,
              setPrompt,
              updateLocalHistory,
              localHistory,
              filePreview: data?.filePreview,
              apiAuthToken,
              userId,
              tags,
            });
          })
          .catch((error) => {
            console.error(error);
          });
      }
    } catch (error) {
      console.error("Failed to fetch CSRF token:", error);
    }
  };

  return (
    <div>
      <TourProvider className="!bg-slate-900 !text-slate-100" steps={steps}>
        <FormControls
          handleSummarize={handleSummarizeFromAi}
          file={file}
          handleImageResponse={handleImageResponseFromAi}
          className="lg:mb-20"
        />
        <ResponseRenderer
          summary={summary}
          loading={loading}
          filePreview={filePreview}
          prompt={prompt}
          summaryRef={summaryRef}
          childClassNames={{
            ...childClasses,
            textToSpeech: `${childClasses.textToSpeech} top-2`,
          }}
        />
      </TourProvider>
    </div>
  );
};

export default GeminiAiWrapper;
