"use client";
import ResponseRenderer, {
  childClasses,
} from "@/components/Gemini/ResponseRenderer/ResponseRenderer";
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
      post={{
        isImageResponse: activeHistory?.responseType === "image",
        username: activeHistory.user.name || "",
        filePreview: activeHistory?.filePreview || "",
        prompt: activeHistory?.prompt || "",
        summary: activeHistory?.response || "",
        createdAt: activeHistory?.createdAt || "",
        tags: activeHistory?.tags || [],
      }}
      summaryRef={summaryRef}
      usermail={usermail}
      className="p-3 lg:p-5 lg:mt-0 !pt-5"
      childClassNames={{
        ...childClasses,
        container: "w-full pt-10",
        heading:
          "text-3xl lg:text-5xl mt-5 mb-10 bg-clip-text text-base-content",
        markdown: `${childClasses.markdown} pt-0 lg:pt-10`,
        textToSpeech: `${childClasses.textToSpeech} top-2`,
        imageContainer: `${childClasses.imageContainer} lg:w-[calc(100%-10rem)] mt-10 lg:mt-0`,
      }}
    />
  );
};

export default HistoryPageWrapper;
