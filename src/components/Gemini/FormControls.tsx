import React from "react";
import Dropdown from "../Dropdown";

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
  inputText,
  setInputText,
  handleSummarize,
  loading,
  className,
}: {
  inputText: string;
  setInputText: (text: string) => void;
  handleSummarize: (item: string) => void;
  loading: boolean;
  className?: string;
}) => {
  return (
    <section className={className}>
      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Paste your prompt here..."
        rows={10}
        className="text-pretty textarea textarea-info w-full mb-6 lg:mb-10"
        disabled={loading}
      />
      <div className="flex justify-between items-center lg:justify-center lg:gap-10">
        <Dropdown
          onClick={handleSummarize}
          setInputText={setInputText}
          loading={loading}
          {...promptsSample}
        />
        <button
          onClick={() => handleSummarize(inputText)}
          disabled={loading || !inputText}
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
        </button>
      </div>
    </section>
  );
};

export default FormControls;
