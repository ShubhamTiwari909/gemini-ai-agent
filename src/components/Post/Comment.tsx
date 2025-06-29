import { Comments } from "@/types/response-handlers";
import Image from "next/image";
import React, { useState } from "react";
import PostReplies from "./PostReplies";
import { User } from "next-auth";
import { FaHeart } from "react-icons/fa";
import Link from "next/link";
import { LuReplyAll } from "react-icons/lu";
import { compactNumberFormat } from "@/lib/utils";

const Comment = ({
  comment,
  user,
  postId,
  setComment,
  limit,
}: {
  comment: Comments | undefined;
  user: User;
  postId: string;
  setComment: React.Dispatch<React.SetStateAction<Comments[] | undefined>>;
  limit: number;
}) => {
  const [showReply, setShowReply] = useState(false);
  const handleCommentLikes = () => {
    fetch(
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
    )
      .then((res) => res.json())
      .then((result) => {
        setComment((prevComments) =>
          prevComments?.map((comment) =>
            comment.id === result.comment.id ? result.comment : comment,
          ),
        );
      });
  };

  const handleReplyLikes = (replyId: string) => {
    fetch(
      `${process.env.NEXT_PUBLIC_EXPRESS_API_URL as string}/posts/updateReplyLikes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          postId,
          commentId: comment?.id,
          replyId,
          user,
        }),
      },
    )
      .then((res) => res.json())
      .then((result) => {
        setComment(result.comments);
      });
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
                  <li key={reply.id}>
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
                    <div className="ml-2">
                      <button
                        className="cursor-pointer text-xs text-base-content flex items-center gap-1"
                        onClick={() => handleReplyLikes(reply?.id)}
                      >
                        <FaHeart className="mt-0.5" color="red" />
                        {reply?.likes?.length || 0}
                      </button>
                    </div>
                  </li>
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
