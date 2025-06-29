import { copyLinkToClipboard, formatDate } from "@/lib/utils";
import { User } from "next-auth";
import React from "react";
import PostViews from "../Post/PostViews";
import { Posts } from "@/types/response-handlers";
import PostLikes from "../Post/PostLikes";
import ViewComments from "../Post/ViewComments";
import ViewDownload from "../Post/ViewDownload";
import { FaCopy, FaRegCopy } from "react-icons/fa";

const CardFooter = ({
  className,
  user,
  post,
}: {
  className?: string;
  user: User;
  post: Posts;
}) => {
  const [copy, setCopy] = React.useState<boolean>(false);
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
          <ViewDownload
            response={post.response}
            prompt={post.prompt}
            postId={post?.postId as string}
            downloads={post.downloads}
          />
        ) : null}
        <button
          className="ml-auto cursor-pointer relative"
          onClick={() => {
            setCopy(true);
            copyLinkToClipboard(
              `${process.env.NEXT_PUBLIC_DOMAIN_URL}/post/${post._id}`,
            );
            setTimeout(() => {
              setCopy(false);
            }, 2000);
          }}
        >
          {copy ? (
            <span className="text-xs text-white inline-block absolute -top-10 right-0">
              Link Copied!
            </span>
          ) : null}
          {copy ? (
            <FaCopy size="0.9rem" color="#ffffff" />
          ) : (
            <FaRegCopy size="0.9rem" color="#ffffff" />
          )}
        </button>
      </div>
    </div>
  );
};

export default CardFooter;
