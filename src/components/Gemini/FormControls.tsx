import React, { useEffect, useState } from "react";
import Dropdown from "../Dropdown";
import SpeechRecognitionUI from "./SpeechRecognition";
import ImageUpload from "./ImageUpload";
import { useGlobalStore } from "@/store/global-store";
import * as motion from "motion/react-client";

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

type GenerateButtonProps = {
  stopSpeech: () => void;
  loading: boolean;
  handleSummarize: (item: string) => void;
  handleImageResponse: () => void;
  inputText: string;
  file: File | null;
};
type FormControlsProps = {
  handleSummarize: (item: string) => void;
  loading: boolean;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  file: File | null;
  handleImageResponse: () => void;
  className?: string;
};

const FormControls = ({
  handleSummarize,
  loading,
  setFile,
  file,
  handleImageResponse,
  className,
}: FormControlsProps) => {
  const [inputText, setInputText] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const setIsPaused = useGlobalStore((state) => state.setIsSpeechPaused);

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
      <SpeechRecognitionUI
        stopSpeech={stopSpeech}
        loading={loading}
        setInput={setInputText}
      />
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
        rows={10}
        className="text-pretty textarea textarea-info w-full mb-6 lg:mb-10"
        disabled={loading || !!file}
      />
      <div className="flex flex-wrap gap-5 items-center justify-center lg:gap-10">
        <Dropdown
          onClick={handleSummarize}
          setInputText={setInputText}
          loading={loading}
          stopSpeech={stopSpeech}
          {...promptsSample}
        />
        <GenerateButton
          stopSpeech={stopSpeech}
          loading={loading}
          handleSummarize={handleSummarize}
          handleImageResponse={handleImageResponse}
          inputText={inputText}
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
  inputText,
  file,
}: GenerateButtonProps) => {
  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeInOut", times: 1 }}
      onClick={() => {
        stopSpeech();
        if (file?.name) {
          handleImageResponse();
        } else {
          handleSummarize(inputText);
        }
      }}
      disabled={(loading || !inputText) && !file?.name}
      className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-800 px-10 py-3 text-lg font-medium text-white backdrop-blur-3xl">
        {loading ? (
          <p className="text-white flex items-center gap-x-3">
            Generating
            <span className="inline-block size-5 animate-spin rounded-full border-4 border-r-transparent border-solid border-current"></span>
          </p>
        ) : (
          "Generate"
        )}
      </span>
    </motion.button>
  );
};
