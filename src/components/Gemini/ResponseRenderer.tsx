"use client";
import React, { useRef } from "react";
import Markdown, { ExtraProps } from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaCopy, FaRegCopy } from "react-icons/fa";
import { Viewer } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Worker } from "@react-pdf-viewer/core";

import TextToSpeech from "../TextToSpeech";
import Image from "next/image";
import { base64ToText, formatDate } from "@/lib/utils";
import Link from "next/link";

export const childClasses = {
  container: "w-full p-2.5 border border-solid border-cyan-300 rounded-lg",
  imageContainer:
    "flex justify-center mb-5 border border-solid border-base-content rounded-xl",
  heading:
    "text-3xl my-5 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500",
  textToSpeech: "absolute lg:right-8 lg:top-8 right-3 top-0 ",
  markdown: "prose prose-base w-full max-w-full lg:pr-28 py-5",
};

const extractLanguage = (filePreview: string) => {
  const contentType = filePreview.split(";")[0];
  const languageType = {
    "data:text/html": "html",
    "data:text/css": "css",
    "data:text/javascript": "javascript",
    "data:text/typescript": "typescript",
    "data:text/python": "python",
  };
  return languageType[contentType as keyof typeof languageType];
};

const ResponseRenderer = ({
  usermail,
  username,
  filePreview,
  prompt,
  summaryRef,
  summary,
  loading,
  createdAt,
  className,
  childClassNames = childClasses,
}: {
  usermail?: string | undefined | null;
  username?: string;
  filePreview?: string | null;
  prompt?: string;
  summaryRef: React.RefObject<HTMLDivElement | null>;
  summary: string;
  loading?: boolean;
  createdAt?: string;
  className?: string;
  childClassNames?: {
    container?: string;
    imageContainer?: string;
    heading?: string;
    textToSpeech?: string;
    markdown?: string;
  };
}) => {
  const [copySuccess, setCopySuccess] = React.useState(false);
  const syntaxHighlighterRef = useRef<SyntaxHighlighter>(null);

  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  const { container, imageContainer, heading, textToSpeech, markdown } =
    childClassNames;

  const handleCopyToClipboard = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setCopySuccess(true);
      setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
    }
  };

  return (
    <section
      ref={summaryRef}
      className={`relative pt-16 lg:pt-0 !overflow-auto ${className} `}
    >
      <Loader loading={loading} summary={summary} />
      {summary && (
        <div className={`${loading ? "select-none" : ""} ${container}`}>
          {filePreview && (
            <>
              <div className={imageContainer}>
                {filePreview.includes("application/pdf") && (
                  <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                    <Viewer
                      fileUrl={filePreview}
                      plugins={[defaultLayoutPluginInstance]}
                    />
                  </Worker>
                )}
                {filePreview.includes("image") && (
                  <Image
                    src={filePreview || ""}
                    alt={prompt || "File preview"}
                    width={400}
                    height={400}
                    className="w-full h-96 object-contain"
                  />
                )}
                {filePreview.includes("text") && (
                  <div className="[&_div]:!w-full w-full">
                    <SyntaxHighlighter
                      language={extractLanguage(filePreview)}
                      PreTag="div"
                      style={atomDark}
                      ref={syntaxHighlighterRef}
                      wrapLongLines
                      showLineNumbers
                    >
                      {base64ToText(filePreview)}
                    </SyntaxHighlighter>
                  </div>
                )}
              </div>
              <CreatedAtByUsername
                usermail={usermail}
                createdAt={createdAt}
                username={username}
              />
            </>
          )}
          {!filePreview && prompt ? (
            <div className="lg:pt-0 mb-10 lg:mb-0 lg:mr-30">
              <h2 className={heading}>
                {prompt.slice(
                  0,
                  prompt.indexOf("- Generate the entire response in"),
                )}
              </h2>
              <CreatedAtByUsername
                usermail={usermail}
                createdAt={createdAt}
                username={username}
              />
            </div>
          ) : null}
          <TextToSpeech text={summary} className={textToSpeech} />
          <Markdown
            remarkPlugins={[remarkGfm]}
            components={{
              // Render a code block with syntax highlighting and a copy button
              code(
                props: React.ClassAttributes<HTMLElement> &
                  React.HTMLAttributes<HTMLElement> &
                  ExtraProps,
              ) {
                const { children, className, ...rest } = props;
                // Extract the language from the className
                const match = /language-(\w+)/.exec(className || "");

                return match ? (
                  <div className="relative">
                    <div className="absolute top-2 right-2">
                      <button
                        onClick={() =>
                          handleCopyToClipboard(
                            String(children).replace(/\n$/, ""),
                          )
                        }
                      >
                        {copySuccess ? (
                          <div className="flex items-center gap-1">
                            <FaCopy size="1.5rem" /> Copied...
                          </div>
                        ) : (
                          <FaRegCopy size="1.5rem" />
                        )}
                      </button>
                    </div>
                    {/* Use SyntaxHighlighter to display the code with styling */}
                    <SyntaxHighlighter
                      {...rest}
                      PreTag="div"
                      language={match[1]}
                      style={atomDark}
                      ref={syntaxHighlighterRef}
                      showLineNumbers
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  </div>
                ) : (
                  // Render a plain code element if no language is specified
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              },
              a: ({ className, children, ...props }) => {
                return (
                  <a
                    {...props}
                    className={className}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {children}
                  </a>
                );
              },
            }}
            className={markdown}
          >
            {summary}
          </Markdown>
        </div>
      )}
    </section>
  );
};

export default ResponseRenderer;

const Loader = ({
  loading,
  summary,
}: {
  loading: boolean | undefined;
  summary: string;
}) => {
  return (
    loading &&
    summary && (
      <div className="absolute inset-0 bg-slate-900/30 lg:grid lg:place-items-center h-full">
        <p className="text-2xl lg:text-4xl font-bold text-center text-slate-100 pt-20">
          Refreshing content...
        </p>
      </div>
    )
  );
};

const CreatedAtByUsername = ({
  createdAt,
  username,
  usermail,
}: {
  createdAt: string | undefined;
  username: string | undefined;
  usermail: string | undefined | null;
}) => {
  return (
    createdAt && (
      <p className="text-sm lg:text-lg text-base-content font-semibold mb-5">
        Created - {formatDate(createdAt || "")} {username ? "by " : ""}
        {username ? (
          <Link
            href={`/users/${usermail}`}
            className="mt-2 lg:mt-0 inline-block font-bold py-2 px-4 rounded-full bg-base-content text-base-100 lg:ml-2"
          >
            {username}
          </Link>
        ) : (
          ""
        )}
      </p>
    )
  );
};
