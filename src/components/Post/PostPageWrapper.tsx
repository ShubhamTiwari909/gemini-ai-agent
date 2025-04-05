"use client";
import ResponseRenderer, {
  childClasses,
} from "@/components/Gemini/ResponseRenderer/ResponseRenderer";
import { Posts } from "@/types/response-handlers";
import React, { useEffect, useRef } from "react";

const PostPageWrapper = ({
  activePost,
  usermail,
}: {
  activePost: Posts;
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
        username: activePost.user.name || "",
        filePreview: activePost?.filePreview || "",
        prompt: activePost?.prompt || "",
        summary: activePost?.response || "",
        createdAt: activePost?.createdAt || "",
        tags: activePost?.tags || [],
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

export default PostPageWrapper;
