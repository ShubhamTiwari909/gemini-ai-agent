"use client";
import { Comments, Replies } from "@/types/response-handlers";
import { User } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FaHeart, FaTrash } from "react-icons/fa";

const RepliesList = ({
  reply,
  postId,
  commentId,
  user,
  setComment,
}: {
  reply: Replies;
  postId: string;
  commentId: string;
  user: User;
  setComment: React.Dispatch<React.SetStateAction<Comments[] | undefined>>;
}) => {
  const handleReplyLikes = async (replyId: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EXPRESS_API_URL as string}/posts/updateReplyLikes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
          },
          body: JSON.stringify({
            postId,
            commentId,
            replyId,
            user,
          }),
        },
      );
      const result = await response.json();
      setComment(result.comments);
    } catch (error) {
      console.error("Error updating reply likes:", error);
    }
  };
  const handleDeleteReply = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EXPRESS_API_URL as string}/posts/delete/reply`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
          },
          body: JSON.stringify({
            postId,
            commentId,
            replyId: reply?.id,
          }),
        },
      );
      const result = await response.json();
      setComment(result.comments);
    } catch (error) {
      console.error("Error deleting reply:", error);
    }
  };
  return (
    <li>
      <div className="mb-2 p-3.5 border border-base-content rounded-xl">
        <Link
          href={`/users/${reply.user.userId}`}
          className="flex flex-wrap items-center gap-2 mb-2"
        >
          <Image
            src={reply.user.image || ""}
            alt={reply.user.name || ""}
            width={30}
            height={30}
            className="rounded-full"
          />
          <p className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-sky-400">
            {reply.user.name}
          </p>
        </Link>
        <p className="text-sm font-semibold text-balance text-base-content mb-2 ml-10">
          {reply?.text}
        </p>
      </div>
      <div className="ml-2 flex flex-wrap items-center gap-5">
        <button
          className="cursor-pointer text-xs text-base-content flex items-center gap-1"
          onClick={() => handleReplyLikes(reply?.id)}
        >
          <FaHeart className="mt-0.5" color="red" />
          {reply?.likes?.length || 0}
        </button>
        <button
          className="cursor-pointer text-xs text-base-content flex items-center gap-1"
          onClick={handleDeleteReply}
        >
          <FaTrash className="mt-0.5" color="red" />
        </button>
      </div>
    </li>
  );
};

export default RepliesList;
