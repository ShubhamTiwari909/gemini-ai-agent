import React, { useEffect } from "react";
import Dropdown from "../Dropdown";
import SpeechRecognitionUI from "./SpeechRecognition";
import ImageUpload from "./ImageUpload";
import { useGlobalStore } from "@/store/global-store";
import * as motion from "motion/react-client";
import { FormControlsProps, GenerateButtonProps } from "@/types/form";

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
  setFile,
  file,
  handleImageResponse,
  setFilePreview,
  className,
}: FormControlsProps) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const setIsPaused = useGlobalStore((state) => state.setIsSpeechPaused);
  const loading = useGlobalStore((state) => state.loading);
  const setInputText = useGlobalStore((state) => state.setInputText);

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
      <SpeechRecognitionUI stopSpeech={stopSpeech} />
      <Textarea file={file} />
      <div className="flex flex-wrap gap-5 items-center justify-center lg:gap-10">
        <Dropdown
          onClick={handleSummarize}
          setInputText={setInputText}
          loading={loading}
          stopSpeech={stopSpeech}
          setFilePreview={setFilePreview}
          {...promptsSample}
        />
        <LanguageDropdown stopSpeech={stopSpeech} />
        <GenerateButton
          setPreview={setFilePreview}
          stopSpeech={stopSpeech}
          loading={loading}
          handleSummarize={handleSummarize}
          handleImageResponse={handleImageResponse}
          file={file}
        />
        <ImageUpload
          stopSpeech={stopSpeech}
          fileInputRef={fileInputRef}
          setFile={setFile}
        />
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
  setPreview,
  file,
}: GenerateButtonProps) => {
  const inputText = useGlobalStore((state) => state.inputText);
  const language = useGlobalStore((state) => state.language);

  return (
    <>
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut", times: 1 }}
        onClick={() => {
          stopSpeech();
          if (inputText !== "") {
            setPreview(null);
          }
          if (file?.name) {
            handleImageResponse();
          } else {
            handleSummarize(
              `${inputText} - Generate the entire response in ${language} language`,
            );
          }
        }}
        disabled={(loading || !inputText) && !file?.name}
        className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 disabled:cursor-not-allowed"
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
  return (
    <motion.textarea
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
      rows={7}
      className="text-pretty textarea textarea-info w-full mb-6 lg:mb-10"
      disabled={loading || !!file}
    />
  );
};

const languages = [
  "English",
  "Spanish",
  "French",
  "German",
  "Mandarin Chinese",
  "Hindi",
  "Arabic",
  "Portuguese",
  "Bengali",
  "Russian",
  "Japanese",
  "Italian",
  "Turkish",
  "Korean",
  "Vietnamese",
].sort((a, b) => a.localeCompare(b));

const LanguageDropdown = ({ stopSpeech }: { stopSpeech?: () => void }) => {
  const language = useGlobalStore((state) => state.language);
  const setLanguage = useGlobalStore((state) => state.setLanguage);
  const loading = useGlobalStore((state) => state.loading);

  const dropdownContentRef = React.useRef<HTMLUListElement>(null);

  const handleFocus = () => {
    stopSpeech?.();
    dropdownContentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="dropdown">
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeInOut", times: 1 }}
        tabIndex={0}
        role="button"
        className="btn btn-primary btn-outline m-1 !pointer-events-auto"
        disabled={loading}
        onClick={handleFocus}
      >
        Generate in {language.toLocaleUpperCase()}
      </motion.button>
      <ul
        ref={dropdownContentRef}
        tabIndex={0}
        className="dropdown-content scroll-mt-20 menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow max-h-62 flex-col overflow-auto flex-nowrap"
      >
        {languages.map((lang) => (
          <li key={lang}>
            <button
              className={
                language.toLocaleUpperCase() === lang.toLocaleUpperCase()
                  ? "border border-solid border-primary"
                  : ""
              }
              onClick={() => setLanguage(lang.toLocaleLowerCase())}
            >
              {lang.toLocaleUpperCase()}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
