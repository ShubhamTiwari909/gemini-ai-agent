"use client";
import React, { useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import FormControls from "./FormControls";
import ResponseRenderer from "./ResponseRenderer";

const GeminiAiWrapper = () => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const syntaxHighlighterRef = useRef<SyntaxHighlighter>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleSummarize = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/summarizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error summarizing content:", error);
      setSummary("An error occurred while summarizing.");
    } finally {
      setLoading(false);
      summaryRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div>
      <FormControls
        inputText={inputText}
        setInputText={setInputText}
        handleSummarize={handleSummarize}
        loading={loading}
        className="mb-20"
      />
      <ResponseRenderer
        summaryRef={summaryRef}
        syntaxHighlighterRef={syntaxHighlighterRef}
        summary={summary}
        loading={loading}
      />
    </div>
  );
};

export default GeminiAiWrapper;
