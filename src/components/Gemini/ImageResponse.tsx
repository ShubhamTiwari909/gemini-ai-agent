import Image from "next/image";
import React from "react";

const ImageResponse = ({
  src,
  alt,
  width = 400,
  height = 400,
  className = "",
}: {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}) => {
  const filteredAltText = alt
    .slice(0, alt?.indexOf(" - Generate the entire response in"))
    .replace("Generate image: ", "");
  return (
    <div className="flex justify-center items-center">
      <Image
        src={src}
        alt={filteredAltText}
        width={width}
        height={height}
        className={`rounded-xl border-2 border-primary border-solid ${className}`}
      />
    </div>
  );
};

export default ImageResponse;
