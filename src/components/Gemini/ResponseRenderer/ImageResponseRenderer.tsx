import React from "react";
import ImageResponse from "../ImageResponse";
import { FaDownload } from "react-icons/fa";
import { ImageResponseRendererProps } from "@/types/utils";

const ImageResponseRenderer = ({ prompt, src }: ImageResponseRendererProps) => {
  return (
    <div className="flex items-center w-full">
      <div className="w-fit relative">
        <ImageResponse
          src={src || ""}
          alt={prompt || ""}
          width={500}
          className="object-cover object-top"
        />
        <a
          download={`${prompt?.slice(0, prompt?.indexOf("- Generate the entire response in"))}.png`}
          href={src}
          className="absolute top-5 right-5 lg:right-10 p-3 rounded-full bg-base-content"
        >
          <FaDownload size="1.5rem" className="text-base-100" />
        </a>
      </div>
    </div>
  );
};

export default ImageResponseRenderer;
