import React from "react";
import CreatedAtByUsername from "./CreatedAtByUserName";
import { childClasses } from "./ResponseRenderer";
import { ResponseHeaderProps } from "@/types/utils";

const ResponseHeaderUi = ({ prompt, post, usermail }: ResponseHeaderProps) => {
  return (
    <div className="lg:pt-0 mb-10 lg:mb-0 lg:mr-30">
      <h2 className={childClasses.heading}>
        {prompt.slice(0, prompt.indexOf("- Generate the entire response in"))}
      </h2>
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
      <CreatedAtByUsername
        usermail={usermail}
        createdAt={post.createdAt}
        username={post.username}
      />
    </div>
  );
};
export default ResponseHeaderUi;
