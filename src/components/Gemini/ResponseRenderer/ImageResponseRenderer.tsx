import Heading from "@/components/Heading";
import React from "react";
import { childClasses } from "./ResponseRenderer";
import ImageResponse from "../ImageResponse";
import { FaDownload } from "react-icons/fa";
import CreatedAtByUsername from "./CreatedAtByUserName";
import { ImageResponseRendererProps } from "@/types/utils";

const ImageResponseRenderer = ({
  post,
  summary,
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
      <div className="flex justify-center items-center relative">
        <ImageResponse
          src={summary || ""}
          alt={post.prompt || ""}
          className="w-full object-cover object-top"
        />
        <a
          download={`${post.prompt}.png`}
          href={summary}
          className="absolute top-5 right-5 lg:right-10 p-3 rounded-full bg-base-content"
        >
          <FaDownload size="1.5rem" className="text-base-100" />
        </a>
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
