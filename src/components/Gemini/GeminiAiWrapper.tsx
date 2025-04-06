"use client";
import React, { useRef } from "react";
import FormControls from "./FormControls";
import ResponseRenderer, {
  childClasses,
} from "./ResponseRenderer/ResponseRenderer";
import { useGlobalStore } from "@/store/global-store";
import { handleImageResponse, handleSummarize } from "@/lib/utils";
import { TourProvider } from "@reactour/tour";
import { GeminiAiWrapperProps } from "@/types/utils";

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
}: GeminiAiWrapperProps) => {
  // REFS
  // Reference to the DOM element that will display the summary
  const summaryRef = useRef<HTMLDivElement>(null);

  // GLOBAL STATES
  // Retrieve the local posts of prompts and responses from the global store
  const localPosts = useGlobalStore((state) => state.posts);

  // Function to update the local posts in the global store
  const updateLocalPosts = useGlobalStore((state) => state.updatePosts);

  // Update the fileName state in the global store
  const setFileName = useGlobalStore((state) => state.setFileName);

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

  const setInputText = useGlobalStore((state) => state.setInputText);

  /**
   * The current summary in the global store.
   * This state is updated when the Gemini AI model returns a response.
   */
  const summary = useGlobalStore((state) => state.summary);

  const generateImageTag = useGlobalStore((state) => state.generateImageTag);

  const handleSummarizeFromAi = (input: string) => {
    fetch("/api/csrf")
      .then((response) => {
        return response.json();
      })
      .then((token) => {
        if (token) {
          const csrfToken = token.csrfToken;
          handleSummarize({
            input,
            csrfToken,
            summaryRef,
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
          });
        } else {
          console.error("Failed to fetch CSRF token:");
        }
      });
  };

  const handleImageResponseFromAi = () => {
    try {
      fetch("/api/csrf")
        .then((response) => response.json())
        .then((token) => {
          if (token) {
            const csrfToken = token.csrfToken;
            handleImageResponse({
              file,
              csrfToken,
              language,
              summaryRef,
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
            });
          }
        });
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
          post={{
            summary,
            prompt,
            filePreview,
          }}
          loading={loading}
          summaryRef={summaryRef}
          childClassNames={{
            ...childClasses,
            textToSpeech: `${childClasses.textToSpeech} top-2`,
          }}
          showHeader
          className="max-w-5xl mx-auto"
        />
      </TourProvider>
    </div>
  );
};

export default GeminiAiWrapper;
