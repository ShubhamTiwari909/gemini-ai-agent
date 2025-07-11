"use client";
import React, { useEffect, useRef } from "react";
import SampleDropdown from "../Dropdown";
import SpeechRecognitionUI from "./SpeechRecognition";
import ImageUpload from "./ImageUpload";
import { useGlobalStore } from "@/store/global-store";
import * as motion from "motion/react-client";
import { FormControlsProps, GenerateButtonProps } from "@/types/form";
import { blogTags } from "@/lib/contants";
import { useTour } from "@reactour/tour";

const promptsSample = {
  title: "Sample Prompts",
  itemsList: [
    "Write a short story about a futuristic city powered by AI.",
    "Summarize the key events of World War II in 200 words.",
    "Create a weekly workout schedule for a beginner in fitness.",
    "Draft a professional email requesting feedback on a project.",
    "Plan a budget-friendly 7-day trip to Switzerland for two people.",
    "Write a React component to display a list of items with a search bar.",
    "Suggest a healthy meal plan for someone looking to lose weight.",
    "Provide a 15-minute full-body workout routine without equipment.",
    "Generate a LinkedIn post introducing a new product launch.",
    "Suggest weekend activities for a family with kids.",
    "Create a list of three-word horror story ideas.",
    "Summarize the latest trends in artificial intelligence.",
    "What are the differences between a hurricane and a tornado?",
    "Describe how blockchain technology works in simple terms.",
    "Suggest a 7-day travel itinerary for Japan, including cultural highlights.",
  ],
};

const FormControls = ({
  handleSummarize,
  file,
  handleImageResponse,
  className,
}: FormControlsProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const setIsPaused = useGlobalStore((state) => state.setIsSpeechPaused);
  const loading = useGlobalStore((state) => state.loading);
  const setInputText = useGlobalStore((state) => state.setInputText);

  const { setIsOpen } = useTour();

  useEffect(() => {
    if (!loading) {
      setInputText("");
      if (fileInputRef.current) {
        fileInputRef.current.value = ""; // Reset the file input
      }
    }
  }, [loading]);

  const stopSpeech = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsPaused(true);
  };

  return (
    <section className={`${className} relative`}>
      <div className="relative">
        <div className="relative">
          <SpeechRecognitionUI
            stopSpeech={stopSpeech}
            className="voice-input"
          />
          <Textarea file={file} />
          <GenerateImageBtn />
        </div>
      </div>
      <div className="flex flex-wrap gap-5 items-center justify-between lg:gap-10">
        <div className="flex flex-wrap items-center gap-5">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeInOut", times: 1 }}
            className="btn btn-success btn-outline"
            onClick={() => setIsOpen(true)}
          >
            Start Guide
          </motion.button>
          <SampleDropdown
            onClick={handleSummarize}
            loading={loading}
            stopSpeech={stopSpeech}
            {...promptsSample}
          />
          <TagsDropdown
            stopSpeech={stopSpeech}
            list={blogTags}
            btnText="Select a Tag first"
          />
        </div>
        <div className="flex justify-center w-full lg:w-fit">
          <GenerateButton
            stopSpeech={stopSpeech}
            loading={loading}
            handleSummarize={handleSummarize}
            handleImageResponse={handleImageResponse}
            file={file}
          />
        </div>
        <ImageUpload stopSpeech={stopSpeech} fileInputRef={fileInputRef} />
      </div>
    </section>
  );
};

export default FormControls;

const GenerateButton = ({
  stopSpeech,
  loading,
  handleSummarize,
  handleImageResponse,
  file,
}: GenerateButtonProps) => {
  const inputText = useGlobalStore((state) => state.inputText);
  const setFilePreview = useGlobalStore((state) => state.setFilePreview);
  const tags = useGlobalStore((state) => state.tags);

  return (
    <>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut", times: 1 }}
        onClick={() => {
          stopSpeech();
          if (inputText !== "") {
            setFilePreview(null);
          }
          if (file?.name) {
            handleImageResponse();
          } else {
            handleSummarize(inputText);
          }
        }}
        disabled={(loading || !inputText || tags.length === 0) && !file?.name}
        className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:cursor-not-allowed disabled:!opacity-50 cursor-pointer generate-button"
      >
        <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
        <p className="inline-flex h-full w-full items-center justify-center rounded-full bg-slate-800 px-5 lg:px-10 py-3 text-lg font-medium text-white backdrop-blur-3xl">
          {loading ? (
            <span className="text-white flex items-center gap-x-1">
              Generating
              <span className="inline-block size-5 animate-spin rounded-full border-4 border-r-transparent border-solid border-current"></span>
            </span>
          ) : (
            "Generate"
          )}
        </p>
      </motion.button>
    </>
  );
};

const Textarea = ({ file }: { file: File | null }) => {
  const inputText = useGlobalStore((state) => state.inputText);
  const setInputText = useGlobalStore((state) => state.setInputText);
  const loading = useGlobalStore((state) => state.loading);
  const generateImageTag = useGlobalStore((state) => state.generateImageTag);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (generateImageTag) {
      setInputText("Generate image: ");
    } else {
      setInputText("");
    }
  }, [generateImageTag]);

  return (
    <motion.textarea
      ref={inputRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        ease: "easeInOut",
        scale: { type: "spring", visualDuration: 0.4, bounce: 0.5 },
      }}
      value={inputText}
      onChange={(e) => setInputText(e.target.value)}
      placeholder="Paste your prompt here..."
      className="text-pretty textarea textarea-info pb-14 lg:pb-0 w-full mb-6 lg:mb-10 textarea-input min-h-36 field-sizing-content"
      disabled={loading || !!file}
    />
  );
};

const TagsDropdown = ({
  stopSpeech,
  list,
  btnText,
}: {
  stopSpeech?: () => void;
  list: string[];
  btnText: string;
}) => {
  const tags = useGlobalStore((state) => state.tags);
  const setTags = useGlobalStore((state) => state.setTags);
  const loading = useGlobalStore((state) => state.loading);
  const [isOpen, setIsOpen] = React.useState(false);

  const canAddMoreTags = tags.length < 5;
  const removeSelectedTags = canAddMoreTags
    ? list.filter((item) => !tags.includes(item))
    : [];

  const allTags = [...tags, ...removeSelectedTags];

  const dropdownContentRef = React.useRef<HTMLUListElement>(null);

  const handleToggle = () => {
    stopSpeech?.();
    setIsOpen(!isOpen);

    setTimeout(() => {
      dropdownContentRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 100);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownContentRef.current &&
        !dropdownContentRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative inline-block">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut", times: 1 }}
        type="button"
        className="btn btn-primary btn-sm lg:btn-md btn-outline m-1 !pointer-events-auto tags-dropdown"
        disabled={loading}
        onClick={handleToggle}
      >
        {btnText}
      </motion.button>

      {isOpen && (
        <ul
          ref={dropdownContentRef}
          className="absolute left-0 mt-2 w-60 z-10 p-2 shadow bg-base-100 border border-white rounded-box max-h-62 overflow-auto flex flex-col gap-y-4"
        >
          <li className="sticky top-0 bg-base-content text-base-300 rounded-md py-1">
            <p className="px-2 text-sm font-semibold">
              Select any 5 tags - {tags.length}
            </p>
          </li>
          {allTags.map((item) => (
            <li key={item}>
              <button
                className={`w-full cursor-pointer text-left px-2 py-1 rounded ${
                  tags.includes(item)
                    ? "border border-primary"
                    : "hover:bg-base-200"
                }`}
                onClick={() => {
                  if (tags.includes(item)) {
                    setTags(tags.filter((tag) => tag !== item));
                  } else if (canAddMoreTags) {
                    setTags([...tags, item]);
                  }
                }}
              >
                {item.toLocaleUpperCase()}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const GenerateImageBtn = () => {
  const generateImageTag = useGlobalStore((state) => state.generateImageTag);
  const setGenerateImageTag = useGlobalStore(
    (state) => state.setGenerateImageTag,
  );
  const setInputText = useGlobalStore((state) => state.setInputText);
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut", times: 1 }}
      className="btn btn-sm lg:btn-md btn-outline btn-primary w-36 absolute bottom-10 left-2 lg:left-[unset] lg:bottom-14 lg:right-2"
      onClick={() => {
        setGenerateImageTag(!generateImageTag);
        setInputText("Generate image: ");
      }}
    >
      {generateImageTag ? "Generate Text" : "Generate Image"}
    </motion.button>
  );
};
