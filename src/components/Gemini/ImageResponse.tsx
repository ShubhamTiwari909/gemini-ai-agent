"use client";
import { ImageResponseProps } from "@/types/utils";
import Image from "next/image";
import React from "react";

const ImageResponse = ({
  src,
  alt,
  width = 400,
  height = 400,
  className = "",
}: ImageResponseProps) => {
  const filteredAltText = alt
    .slice(0, alt?.indexOf(" - Generate the entire response in"))
    .replace("Generate image: ", "");
  return (
    <Image
      src={src}
      alt={filteredAltText}
      width={width}
      height={height}
      className={`rounded-xl border-2 border-primary border-solid ${className}`}
    />
  );
};

export default ImageResponse;
