import React from "react";
import CreatedAtByUsername from "./CreatedAtByUserName";
import { childClasses } from "./ResponseRenderer";
import { ResponseHeaderProps } from "@/types/utils";
import PostViews from "./PostViews";
import { User } from "next-auth";

const ResponseHeaderUi = ({
  prompt,
  post,
  usermail,
  user,
  showViews,
}: ResponseHeaderProps) => {
  console.log(showViews);
  return (
    <div className="lg:pt-0 mb-10 lg:mb-0 lg:mr-30">
      <h2
        className={`${childClasses.heading} line-clamp-1 lg:line-clamp-none text-ellipsis`}
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
        <CreatedAtByUsername
          usermail={usermail}
          createdAt={post.createdAt}
          username={post?.user?.name}
        />
        {showViews && (
          <PostViews
            expressUrl={process.env.NEXT_PUBLIC_EXPRESS_API_URL as string}
            postId={post?.postId as string}
            user={user}
            views={post.views as User[]}
          />
        )}
      </div>
    </div>
  );
};
export default ResponseHeaderUi;
