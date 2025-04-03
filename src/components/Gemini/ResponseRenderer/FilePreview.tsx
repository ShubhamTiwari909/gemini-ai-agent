import React, { useRef } from "react";
import { childClasses } from "./ResponseRenderer";
import Image from "next/image";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import SyntaxHighlighter from "react-syntax-highlighter";
import { atomDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { base64ToText } from "@/lib/utils";
import CreatedAtByUsername from "./CreatedAtByUserName";
import { FilePreviewProps } from "@/types/utils";

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

const FilePreview = ({
  filePreview,
  prompt,
  createdAt,
  usermail,
  username,
}: FilePreviewProps) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const syntaxHighlighterRef = useRef<SyntaxHighlighter>(null);

  return (
    <>
      <div className={childClasses.imageContainer}>
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
  );
};

export default FilePreview;
