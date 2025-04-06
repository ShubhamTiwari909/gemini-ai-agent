"use client";
import ResponseRenderer, {
  childClasses,
} from "@/components/Gemini/ResponseRenderer/ResponseRenderer";
import { Posts } from "@/types/response-handlers";
import { User } from "next-auth";
import React, { useEffect, useRef } from "react";

const PostPageWrapper = ({
  activePost,
  usermail,
  user,
}: {
  activePost: Posts;
  usermail: string | undefined | null;
  user: User;
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
        user: activePost?.user || {},
        postId: activePost?.postId || "",
        views: activePost?.views || 0,
        likes: activePost?.likes || 0,
      }}
      user={user}
      summaryRef={summaryRef}
      usermail={usermail}
      showHeader={true}
      showViews={true}
      showLikes={true}
      className="p-3 lg:p-5 lg:mt-0 !pt-5 max-w-5xl mx-auto"
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
