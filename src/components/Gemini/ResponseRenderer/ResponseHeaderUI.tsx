import React from "react";
import CreatedAtByUsername from "./CreatedAtByUserName";
import { childClasses } from "./ResponseRenderer";
import { ResponseHeaderProps } from "@/types/utils";
import PostViews from "../../Post/PostViews";
import { User } from "next-auth";
import PostLikes from "@/components/Post/PostLikes";

const ResponseHeaderUi = ({
  prompt,
  post,
  user,
  showViews,
  showLikes,
}: ResponseHeaderProps) => {
  return (
    <div className="lg:pt-0 mb-10 lg:mb-0">
      <h2
        className={`${childClasses.heading} line-clamp-3 lg:line-clamp-5 text-ellipsis lg:mr-30`}
      >
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
      <div className="flex flex-wrap justify-between items-center gap-3">
        {post?.user?.userId && (
          <CreatedAtByUsername
            userId={post?.user?.userId}
            createdAt={post.createdAt}
            username={post?.user?.name}
          />
        )}
        <div className="flex flex-wrap gap-6 items-center">
          {showViews && (
            <PostViews
              postId={post?.postId as string}
              user={user}
              views={post.views as User[]}
            />
          )}
          {showLikes && (
            <PostLikes
              user={user}
              postId={post?.postId as string}
              postLikes={post?.likes as User[]}
            />
          )}
        </div>
      </div>
    </div>
  );
};
export default ResponseHeaderUi;
