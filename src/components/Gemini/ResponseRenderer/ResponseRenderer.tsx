"use client";
import React from "react";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";

import TextToSpeech from "../../TextToSpeech";
import Loader from "./Loader";
import ImageResponseRenderer from "./ImageResponseRenderer";
import FilePreview from "./FilePreview";
import ResponseHeaderUi from "./ResponseHeaderUI";
import MarkdownRenderer from "./MarkdownRender";
import { ResponseRendererProps } from "@/types/utils";
import { User } from "next-auth";

export const childClasses = {
  container:
    "w-full px-2.5 py-8 border border-solid border-cyan-300 rounded-lg h-fit",
  imageContainer:
    "flex justify-center mb-5 border border-solid border-base-content rounded-xl",
  heading:
    "text-3xl my-5 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500",
  textToSpeech: "absolute lg:right-8 lg:top-8 right-3 top-0 ",
  markdown:
    "prose prose-base overflow-hidden [&_p]:break-words w-full max-w-full lg:pr-28 py-5",
};

const ResponseRenderer = ({
  post,
  usermail,
  summaryRef,
  loading,
  user,
  showHeader = false,
  showViews = false,
  showLikes = false,
  className = "",
  childClassNames = childClasses,
}: ResponseRendererProps) => {
  const { username, filePreview, prompt, summary, createdAt } = post;

  const { container, textToSpeech } = childClassNames;

  return (
    <section
      ref={summaryRef}
      className={`relative !overflow-auto mt-5 ${className} `}
    >
      <Loader loading={loading} summary={summary as string} />
      {showHeader && (
        <ResponseHeaderUi
          user={user as User}
          prompt={prompt as string}
          post={post}
          usermail={usermail}
          showViews={showViews}
          showLikes={showLikes}
        />
      )}
      {summary && summary.includes("data:image") ? (
        <>
          <ImageResponseRenderer post={post} src={summary} />
        </>
      ) : (
        <div className={`${loading ? "select-none" : ""} ${container}`}>
          {filePreview && (
            <FilePreview
              filePreview={filePreview}
              prompt={prompt || ""}
              createdAt={createdAt}
              usermail={usermail}
              username={username}
            />
          )}
          <TextToSpeech text={summary} className={textToSpeech} />
          <MarkdownRenderer summary={summary} />
        </div>
      )}
    </section>
  );
};

export default ResponseRenderer;
