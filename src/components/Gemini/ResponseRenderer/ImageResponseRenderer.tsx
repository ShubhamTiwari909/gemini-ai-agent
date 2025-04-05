import Heading from "@/components/Heading";
import React from "react";
import { childClasses } from "./ResponseRenderer";
import ImageResponse from "../ImageResponse";
import { FaDownload } from "react-icons/fa";
import CreatedAtByUsername from "./CreatedAtByUserName";
import { ImageResponseRendererProps } from "@/types/utils";

const ImageResponseRenderer = ({
  post,
  src,
  usermail,
}: ImageResponseRendererProps) => {
  return (
    <div>
      <Heading prompt={post.prompt || ""} className={childClasses.heading} />
      {post.tags && (
        <ul className="mb-8 flex flex-wrap gap-5">
          {post.tags.map((tag: string, index: number) => (
            <li
              key={index}
              className="inline-block px-2 py-1 mr-2 text-xs font-semibold text-gray-700 bg-base-content rounded-full"
            >
              #{tag}
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center w-full">
        <div className="w-fit relative">
          <ImageResponse
            src={src || ""}
            alt={post.prompt || ""}
            width={500}
            className="object-cover object-top"
          />
          <a
            download={`${post.prompt?.slice(0, post.prompt?.indexOf("- Generate the entire response in"))}.png`}
            href={src}
            className="absolute top-5 right-5 lg:right-10 p-3 rounded-full bg-base-content"
          >
            <FaDownload size="1.5rem" className="text-base-100" />
          </a>
        </div>
      </div>
      <div className="mt-10">
        <CreatedAtByUsername
          usermail={usermail}
          createdAt={post.createdAt}
          username={post.username}
        />
      </div>
    </div>
  );
};

export default ImageResponseRenderer;
