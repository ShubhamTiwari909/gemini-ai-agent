"use client";
import React, { useRef, useState } from "react";
import FormControls from "./FormControls";
import ResponseRenderer from "./ResponseRenderer";
import { Session } from "next-auth";
import { useGlobalStore } from "@/store/global-store";

const GeminiAiWrapper = ({
  user,
  expressUrl,
}: {
  user: Session["user"];
  expressUrl: string;
}) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);
  const localHistory = useGlobalStore((state) => state.history);
  const updateLocalHistory = useGlobalStore((state) => state.updateHistory);
  const [prompt, setPrompt] = useState("");

  const handleSummarize = async (input: string) => {
    setLoading(true);
    try {
      const response = await fetch("/api/gemini-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: input }),
      });
      const data = await response.json();
      if (data) {
        const historyId = `${input.split(" ").join("-").slice(0, 10)}-${data.summary.split(" ").join("-").slice(0, 10)}-${user?.email}`;

        await fetch(`${expressUrl}/history/add`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prompt: input,
            response: data.summary,
            email: user?.email,
            historyId: historyId,
          }),
        });

        updateLocalHistory([
          ...localHistory,
          {
            historyId: historyId,
            email: user?.email || "",
            prompt: input,
            response: data.summary,
          },
        ]);
        setPrompt(input);
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
        handleSummarize={handleSummarize}
        loading={loading}
        className="mb-20"
      />
      <ResponseRenderer
        prompt={prompt}
        summaryRef={summaryRef}
        summary={summary}
        loading={loading}
      />
    </div>
  );
};

export default GeminiAiWrapper;
