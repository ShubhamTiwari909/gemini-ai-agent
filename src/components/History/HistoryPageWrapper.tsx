"use client";
import ResponseRenderer from "@/components/Gemini/ResponseRenderer";
import React, { useEffect, useRef } from "react";
import { History } from "./HistoryWrapper";

const HistoryPageWrapper = ({ activeHistory }: { activeHistory: History }) => {
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      document.body.style.overflow = "auto";
    }
  }, []);

  return (
    <ResponseRenderer
      filePreview={activeHistory?.filePreview || ""}
      prompt={activeHistory?.prompt || ""}
      summaryRef={summaryRef}
      summary={activeHistory?.response || ""}
      className="p-3 lg:p-5 lg:mt-0 !pt-5"
    />
  );
};

export default HistoryPageWrapper;
