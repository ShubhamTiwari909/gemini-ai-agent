import React from "react";
import { childClasses } from "./ResponseRenderer";
import Image from "next/image";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { FilePreviewProps } from "@/types/utils";
import ViewDownload from "@/components/Post/ViewDownload";

const FilePreview = ({
  filePreview,
  prompt,
  showDownload,
  postId,
  downloads,
}: FilePreviewProps) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <>
      <div className={`${childClasses.imageContainer} relative`}>
        {(filePreview.includes("application/pdf") ||
          filePreview.includes("files")) && (
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
            <Viewer
              fileUrl={filePreview}
              plugins={[defaultLayoutPluginInstance]}
            />
          </Worker>
        )}
        {filePreview.includes("image") && !filePreview.includes("files") && (
          <Image
            src={filePreview || ""}
            alt={prompt || "File preview"}
            width={400}
            height={400}
            className="w-full h-96 object-contain"
          />
        )}
        {showDownload ? (
          <ViewDownload
            response={filePreview || ""}
            prompt={prompt}
            postId={postId}
            downloads={downloads}
            className="absolute top-5 right-5 lg:right-3 lg:top-3 p-3 rounded-full bg-base-300 cursor-pointer"
          />
        ) : null}
      </div>
    </>
  );
};

export default FilePreview;
