import { Comments } from "@/types/response-handlers";
import Image from "next/image";
import React, { useState } from "react";
import PostReplies from "./PostReplies";
import { User } from "next-auth";
import { FaHeart } from "react-icons/fa";

const Comment = ({
  comment,
  user,
  postId,
  setComment,
}: {
  comment: Comments | undefined;
  user: User;
  postId: string;
  setComment: React.Dispatch<React.SetStateAction<Comments[] | undefined>>;
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
        }),
      },
    )
      .then((res) => res.json())
      .then((result) => {
        setComment(result.comments);
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
        <div className="flex flex-wrap items-center gap-2">
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
        </div>
        <p className="text-sm text-balance font-semibold text-slate-300 ml-10">
          {comment?.text}
        </p>
      </div>
      <div>
        <div className="reply-box">
          <div className="flex flex-wrap items-center gap-3 ml-2">
            <button
              className="cursor-pointer text-xs text-base-content"
              onClick={() => setShowReply(!showReply)}
            >
              Reply
            </button>
            <button
              className="cursor-pointer text-xs text-base-content flex items-center gap-1"
              onClick={handleCommentLikes}
            >
              <FaHeart className="mt-0.5" color="red" />
              {comment?.likes?.length || 0}
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
                      <div className="flex flex-wrap items-center gap-2 mb-2">
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
                      </div>
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
