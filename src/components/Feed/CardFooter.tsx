import { formatDate } from "@/lib/utils";
import { User } from "next-auth";
import React from "react";
import PostViews from "../Post/PostViews";
import { Posts } from "@/types/response-handlers";
import PostLikes from "../Post/PostLikes";

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
      className={`flex flex-wrap gap-y-5 justify-between items-center font-bold ${className}`}
    >
      <p className="text-xs">{formatDate(post.createdAt as string)}</p>
      <div className="flex flex-wrap items-center gap-5">
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
      </div>
    </div>
  );
};

export default CardFooter;
