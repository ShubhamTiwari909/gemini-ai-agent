import React from "react";
import ImageResponse from "../ImageResponse";
import { ImageResponseRendererProps } from "@/types/utils";
import { downloadImage } from "@/lib/utils";
import { LuDownload } from "react-icons/lu";

const ImageResponseRenderer = ({
  prompt,
  src,
  renderImage = true,
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
        <button
          onClick={() => downloadImage(src || "", prompt || "image")}
          className="absolute top-5 right-5 lg:right-3 lg:top-3 p-3 rounded-full bg-base-content cursor-pointer"
        >
          <LuDownload size="1.5rem" className="text-base-100" />
        </button>
      </div>
    </div>
  );
};

export default ImageResponseRenderer;
