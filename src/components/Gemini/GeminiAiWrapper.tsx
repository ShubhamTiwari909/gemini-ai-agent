"use client";
import React, { useRef, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import FormControls from "./FormControls";
import ResponseRenderer from "./ResponseRenderer";
import { Session } from "next-auth";

const GeminiAiWrapper = ({
  user,
  expressUrl,
}: {
  user: Session["user"];
  expressUrl: string;
}) => {
  const [inputText, setInputText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const syntaxHighlighterRef = useRef<SyntaxHighlighter>(null);
  const summaryRef = useRef<HTMLDivElement>(null);

  const handleSummarize = async (input: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/summarizer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await response.json();
      if (data) {
        await fetch(`${expressUrl}/history/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: input,
            response: data.summary,
            email: user?.email,
            historyId: Math.floor(Math.random() * 999999099).toString(),
          }),
        });
      }
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
