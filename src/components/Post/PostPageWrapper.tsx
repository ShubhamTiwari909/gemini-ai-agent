"use client";
import { Comments, Posts } from "@/types/response-handlers";
import { User } from "next-auth";
import React, { useEffect, useRef } from "react";
import ResponseHeaderUi from "../Gemini/ResponseRenderer/ResponseHeaderUI";
import ImageResponseRenderer from "../Gemini/ResponseRenderer/ImageResponseRenderer";
import FilePreview from "../Gemini/ResponseRenderer/FilePreview";
import TextToSpeech from "../TextToSpeech";
import MarkdownRenderer from "../Gemini/ResponseRenderer/MarkdownRender";
import PostComments from "./PostComments";

const PostPageWrapper = ({
  post,
  usermail,
  user,
}: {
  post: {
    post: Posts;
    comments: Comments[];
    commentsLength: number;
  };
  usermail: string | undefined | null;
  user: User;
}) => {
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.innerWidth < 1024) {
      document.body.style.overflow = "auto";
    }
  }, []);

  const { post: activePost, comments, commentsLength } = post;

  return (
    <>
      <section
        ref={summaryRef}
        className="relative !overflow-auto mt-5 p-3 lg:p-5 lg:mt-0 !pt-5 max-w-5xl mx-auto"
      >
        <ResponseHeaderUi
          user={user as User}
          prompt={activePost?.prompt}
          post={{
            tags: activePost?.tags || [],
            createdAt: activePost?.createdAt || "",
            user: activePost?.user || {},
            views: activePost?.views || 0,
            postId: activePost?.postId || "",
            likes: activePost?.likes || 0,
          }}
          usermail={usermail}
          showViews={true}
          showLikes={true}
        />
        <div className="w-full py-10">
          {activePost?.response &&
          activePost?.response.includes("data:image") ? (
            <>
              <ImageResponseRenderer
                prompt={activePost.prompt as string}
                src={activePost?.response}
              />
            </>
          ) : (
            <MarkdownRenderer summary={activePost?.response} />
          )}
          {activePost.filePreview && (
            <FilePreview
              filePreview={activePost.filePreview}
              prompt={activePost.prompt || ""}
              createdAt={activePost.createdAt}
              usermail={usermail}
              username={activePost.user?.name || ""}
            />
          )}
          <TextToSpeech
            text={activePost?.response}
            className="absolute lg:right-8 lg:top-8 right-3 top-2"
          />

          <PostComments
            comments={comments}
            user={user as User}
            postId={activePost.postId}
            commentsLength={commentsLength}
            className="mt-10"
          />
        </div>
      </section>
    </>
  );
};

export default PostPageWrapper;
