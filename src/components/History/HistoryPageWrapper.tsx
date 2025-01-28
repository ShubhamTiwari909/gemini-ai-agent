"use client";
import ResponseRenderer from "@/components/Gemini/ResponseRenderer";
import React, { useRef } from "react";
import { History } from "./HistoryWrapper";

const HistoryPageWrapper = ({ activeHistory }: { activeHistory: History }) => {
  const summaryRef = useRef<HTMLDivElement>(null);

  return (
    <ResponseRenderer
      filePreview={activeHistory?.filePreview || ""}
      prompt={activeHistory?.prompt || ""}
      summaryRef={summaryRef}
      summary={activeHistory?.response || ""}
      className="p-3 lg:p-5 !pt-0"
    />
  );
};

export default HistoryPageWrapper;
