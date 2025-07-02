"use client";
import { Comments, Posts } from "@/types/response-handlers";
import { User } from "next-auth";
import React, { useEffect, useRef } from "react";
import ResponseHeaderUi from "../Gemini/ResponseRenderer/ResponseHeaderUI";
import FilePreview from "../Gemini/ResponseRenderer/FilePreview";
import TextToSpeech from "../TextToSpeech";
import MarkdownRenderer from "../Gemini/ResponseRenderer/MarkdownRender";
import PostComments from "./PostComments";
import ImageResponseRenderer from "../Gemini/ResponseRenderer/ImageResponseRenderer";

const PostPageWrapper = ({
  post,
  user,
}: {
  post: {
    post: Posts;
    comments: Comments[];
    commentsLength: number;
  };
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
        className="relative !overflow-auto mt-5 p-3 lg:p-5 lg:mt-0 !pt-15 max-w-5xl mx-auto"
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
          showViews={true}
          showLikes={true}
        />
        <div className="w-full py-10">
          {activePost?.responseType === "image" ? (
            <ImageResponseRenderer
              prompt={activePost.prompt as string}
              src={activePost?.response || ""}
              postId={activePost.postId}
              downloads={activePost.downloads || 0}
            />
          ) : (
            <MarkdownRenderer summary={activePost?.response} />
          )}
          {activePost.filePreview && activePost?.responseType !== "image" && (
            <FilePreview
              filePreview={activePost.filePreview}
              prompt={activePost.prompt || ""}
            />
          )}
          <TextToSpeech
            text={activePost?.response}
            className="absolute lg:right-8 lg:top-8 right-3 top-5"
          />
          {activePost.toggle.comments ? (
            <PostComments
              comments={comments}
              user={user as User}
              postId={activePost.postId}
              commentsLength={commentsLength}
              className="mt-10"
            />
          ) : (
            <div className="mt-20 text-center bg-gray-100 rounded-xl p-5">
              <h2 className="text-red-400 text-xl md:text-2xl font-semibold">
                Comments are disabled on this post!!
              </h2>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default PostPageWrapper;
