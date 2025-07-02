import React from "react";
import ImageResponse from "../ImageResponse";
import { ImageResponseRendererProps } from "@/types/utils";
import ViewDownload from "@/components/Post/ViewDownload";

const ImageResponseRenderer = ({
  prompt,
  src,
  renderImage = true,
  postId,
  downloads,
  showDownload = true,
}: ImageResponseRendererProps) => {
  return (
    <div className="flex items-center w-full">
      <div className="w-fit relative">
        {renderImage ? (
          <ImageResponse
            src={src || ""}
            alt={prompt || ""}
            width={500}
            className="object-cover object-top"
          />
        ) : null}
        {showDownload ? (
          <ViewDownload
            response={src || ""}
            prompt={prompt}
            postId={postId}
            downloads={downloads}
            className="absolute top-5 right-5 lg:right-3 lg:top-3 p-3 rounded-full bg-base-300 cursor-pointer"
          />
        ) : null}
      </div>
    </div>
  );
};

export default ImageResponseRenderer;
