"use client";
import { Comments } from "@/types/response-handlers";
import Image from "next/image";
import React, { useState } from "react";
import PostReplies from "./PostReplies";
import { User } from "next-auth";
import { FaHeart, FaTrash } from "react-icons/fa";
import Link from "next/link";
import { LuReplyAll } from "react-icons/lu";
import { compactNumberFormat } from "@/lib/utils";
import RepliesList from "./RepliesList";

const Comment = ({
  comment,
  user,
  postId,
  setComment,
  limit,
  setCommentsLengthState,
}: {
  comment: Comments | undefined;
  user: User;
  postId: string;
  setComment: React.Dispatch<React.SetStateAction<Comments[] | undefined>>;
  limit: number;
  setCommentsLengthState: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const [showReply, setShowReply] = useState(false);
  const handleCommentLikes = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EXPRESS_API_URL as string}/posts/updateCommentLikes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
          },
          body: JSON.stringify({
            postId,
            commentId: comment?.id,
            user,
            limit,
            skip: limit - 2,
          }),
        },
      );
      const result = await response.json();
      setComment((prevComments) =>
        prevComments?.map((comment) =>
          comment.id === result.comment.id ? result.comment : comment,
        ),
      );
    } catch (error) {
      console.error("Error updating comment likes:", error);
    }
  };

  const handleDeleteComment = async () => {
    if (!comment?.id) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_EXPRESS_API_URL as string}/posts/delete/comment/`,
        {
          method: "DELETE",
          body: JSON.stringify({ postId, commentId: comment.id }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      await response.json();
      setComment((prevComments) =>
        prevComments?.filter((c) => c.id !== comment.id),
      );
      setCommentsLengthState((prev) => prev - 1);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <li>
      <div className="mb-2 p-3.5 border border-base-content rounded-xl">
        <Link
          href={`/users/${comment?.user.userId}`}
          className="flex flex-wrap items-center gap-2"
        >
          <Image
            src={comment?.user.image || ""}
            alt={comment?.user.name || ""}
            width={30}
            height={30}
            className="rounded-full"
          />
          <p className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">
            {comment?.user.name}
          </p>
        </Link>
        <p className="text-sm text-balance font-semibold text-slate-300 ml-10">
          {comment?.text}
        </p>
      </div>
      <div>
        <div className="reply-box">
          <div className="ml-2 flex flex-wrap items-center gap-5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                className="cursor-pointer text-xs text-base-content flex flex-wrap items-center gap-2"
                onClick={() => setShowReply(!showReply)}
              >
                Replies
                <LuReplyAll size="1rem" className="text-slate-100" />
                {compactNumberFormat(comment?.replies?.length || 0)}
              </button>
            </div>
            <button
              className="cursor-pointer text-xs text-base-content flex items-center gap-1"
              onClick={handleCommentLikes}
            >
              <FaHeart className="mt-0.5" color="red" />
              {compactNumberFormat(comment?.likes?.length || 0)}
            </button>
            <button
              className="cursor-pointer text-xs text-base-content flex items-center gap-1"
              onClick={handleDeleteComment}
            >
              <FaTrash className="mt-0.5" color="red" />
            </button>
          </div>
          <PostReplies
            user={user}
            postId={postId}
            commentId={comment?.id}
            setComment={setComment}
            showReply={showReply}
            setShowReply={setShowReply}
            className="mt-5 ml-10"
          />
          {showReply && (
            <ul className="space-y-5 ml-10">
              {comment?.replies.map((reply) => {
                return (
                  <RepliesList
                    key={reply.id}
                    reply={reply}
                    postId={postId}
                    commentId={comment?.id}
                    user={user}
                    setComment={setComment}
                  />
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </li>
  );
};

export default Comment;
