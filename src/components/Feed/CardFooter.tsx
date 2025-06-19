import { downloadImage, formatDate } from "@/lib/utils";
import { User } from "next-auth";
import React from "react";
import PostViews from "../Post/PostViews";
import { Posts } from "@/types/response-handlers";
import PostLikes from "../Post/PostLikes";
import ViewComments from "../Post/ViewComments";
import { LuDownload } from "react-icons/lu";

const CardFooter = ({
  className,
  user,
  post,
}: {
  className?: string;
  user: User;
  post: Posts;
}) => {
  return (
    <div
      className={`space-y-5 font-bold py-3 px-4 bg-slate-900 rounded-2xl border border-base-content ${className}`}
    >
      <p className="text-xs">{formatDate(post.createdAt as string)}</p>
      <div className="flex flex-wrap items-center gap-6">
        <PostLikes
          user={user}
          postId={post?.postId as string}
          postLikes={post?.likes as User[]}
        />
        <PostViews
          postId={post?.postId as string}
          user={user}
          views={post.views as User[]}
        />
        <ViewComments commentsLength={post.comments.length} postId={post._id} />
        {post.responseType === "image" ? (
          <button
            className="text-white text-md cursor-pointer"
            onClick={() =>
              downloadImage(post.response as string, post.prompt as string)
            }
          >
            <LuDownload />
          </button>
        ) : null}
      </div>
    </div>
  );
};

export default CardFooter;
