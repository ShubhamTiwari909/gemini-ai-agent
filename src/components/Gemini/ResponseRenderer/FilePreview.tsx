import React from "react";
import { childClasses } from "./ResponseRenderer";
import Image from "next/image";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import { FilePreviewProps } from "@/types/utils";

const FilePreview = ({ filePreview, prompt }: FilePreviewProps) => {
  const defaultLayoutPluginInstance = defaultLayoutPlugin();

  return (
    <>
      <div className={childClasses.imageContainer}>
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
      </div>
    </>
  );
};

export default FilePreview;
