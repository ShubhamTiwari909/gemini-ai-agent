"use client";
import { Posts } from "@/types/response-handlers";
import React from "react";
import ImageResponse from "../Gemini/ImageResponse";

const Description = ({ post }: { post: Posts }) => {
  return (
    <div
      className={`mb-5 lg:mb-10 ${post.filePreview?.includes("data:image") || post.responseType === "image" ? "text-white" : "text-base-content"}`}
    >
      {post.filePreview?.includes("data:image") ? (
        <>
          <div className="absolute inset-0 -z-10">
            <ImageResponse
              width={500}
              height={500}
              alt={post.prompt}
              src={post.filePreview}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-black/80"></div>
        </>
      ) : null}
      {post.responseType === "image" ? (
        <>
          <div className="absolute inset-0 -z-10">
            <ImageResponse
              width={500}
              height={500}
              alt={post.prompt}
              src={post.response}
              className="w-full h-full object-cover object-top"
            />
          </div>
          <div className="absolute inset-0 -z-10 bg-black/70"></div>
        </>
      ) : (
        `${post.response.slice(0, 200)}...`
      )}
    </div>
  );
};

export default Description;
