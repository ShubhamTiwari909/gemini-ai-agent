"use client";
import ResponseRenderer, {
  childClassses,
} from "@/components/Gemini/ResponseRenderer";
import { History } from "@/types/response-handlers";
import React, { useEffect, useRef } from "react";

const HistoryPageWrapper = ({
  activeHistory,
  usermail,
}: {
  activeHistory: History;
  usermail: string | undefined | null;
}) => {
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      document.body.style.overflow = "auto";
    }
  }, []);

  return (
    <ResponseRenderer
      usermail={usermail}
      username={activeHistory.username || ""}
      filePreview={activeHistory?.filePreview || ""}
      prompt={activeHistory?.prompt || ""}
      summaryRef={summaryRef}
      summary={activeHistory?.response || ""}
      createdAt={activeHistory?.createdAt || ""}
      className="p-3 lg:p-5 lg:mt-0 !pt-5"
      childClassNames={{
        ...childClassses,
        container: "w-full p-2.5 lg:p-5",
        heading: "text-3xl lg:text-5xl my-5 bg-clip-text text-base-content",
        markdown: `${childClassses.markdown} pt-0 lg:pt-10`,
        textToSpeech: `${childClassses.textToSpeech} top-2`,
        imageContainer: `${childClassses.imageContainer} lg:w-[calc(100%-10rem)] mt-10 lg:mt-0`,
      }}
    />
  );
};

export default HistoryPageWrapper;
