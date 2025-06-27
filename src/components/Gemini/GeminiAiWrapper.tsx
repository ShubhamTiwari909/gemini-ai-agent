"use client";
import React, { useRef } from "react";
import FormControls from "./FormControls";
import { useGlobalStore } from "@/store/global-store";
import { addPostToDb, handleImageResponse, handleSummarize } from "@/lib/utils";
import { TourProvider } from "@reactour/tour";
import { GeminiAiWrapperProps } from "@/types/utils";
import Loader from "./ResponseRenderer/Loader";
import ResponseHeaderUi from "./ResponseRenderer/ResponseHeaderUI";
import { User } from "next-auth";
import ImageResponseRenderer from "./ResponseRenderer/ImageResponseRenderer";
import FilePreview from "./ResponseRenderer/FilePreview";
import TextToSpeech from "../TextToSpeech";
import MarkdownRenderer from "./ResponseRenderer/MarkdownRender";

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
  const setGenerateImageTag = useGlobalStore(
    (state) => state.setGenerateImageTag,
  );

  const handleSummarizeFromAi = (input: string) => {
    fetch("/api/csrf")
      .then((response) => {
        return response.json();
      })
      .then((token) => {
        if (token) {
          const csrfToken = token.csrfToken;
          setLoading(true);
          setSummary("");

          const resetStates = () => {
            setFileName("");
            setTags([]);
            setLoading(false);
            setInputText("");
            setGenerateImageTag(false);
          };

          handleSummarize({
            input,
            csrfToken,
          })
            .then((response) => {
              if (response) {
                setSummary(response);
                resetStates();
                addPostToDb({
                  data: response,
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
            })
            .catch((error) => {
              console.error("Error summarizing content:", error);
              setSummary("An error occurred while summarizing.");
            })
            .finally(() => {
              summaryRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
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
              const fileBase64: Promise<string> = new Promise(
                (resolve, reject) => {
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
                },
              );
              fileBase64.then((base64String: string) => {
                if (base64String) {
                  const fileDataUrl = `data:${file.type};base64,${base64String}`;
                  setFilePreview(fileDataUrl);
                  handleImageResponse({
                    file,
                    csrfToken,
                    base64String,
                  }).then((response) => {
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
                  });
                }
              });
            }
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
          className="lg:mb-10"
        />
        <section
          ref={summaryRef}
          className="relative !overflow-auto max-w-7xl mx-auto"
        >
          <Loader loading={loading} summary={summary as string} />
          <ResponseHeaderUi
            user={user as User}
            prompt={prompt as string}
            post={{
              summary,
              prompt,
              filePreview,
              user: {
                userId: userId || "",
              },
            }}
          />
          {summary && summary.includes("data:image") ? (
            <>
              <ImageResponseRenderer prompt={prompt as string} src={summary} />
            </>
          ) : (
            <div
              className={`${loading ? "select-none" : ""} relative w-full px-2.5 py-8 border border-solid border-cyan-300 rounded-lg h-fit`}
            >
              {filePreview && (
                <FilePreview filePreview={filePreview} prompt={prompt || ""} />
              )}
              <TextToSpeech
                text={summary as string}
                className="absolute lg:right-8 lg:top-8 right-3 top-2"
              />
              <MarkdownRenderer summary={summary as string} />
            </div>
          )}
        </section>
      </TourProvider>
    </div>
  );
};

export default GeminiAiWrapper;
