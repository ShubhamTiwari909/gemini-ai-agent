import { Comments } from "@/types/response-handlers";
import { User } from "next-auth";
import React, { useEffect, useState } from "react";

const PostReplies = ({
  user,
  postId,
  commentId,
  setComment,
  showReply,
  setShowReply,
  className,
}: {
  user: User;
  postId: string;
  commentId: string | undefined;
  setComment: React.Dispatch<React.SetStateAction<Comments[] | undefined>>;
  showReply: boolean;
  setShowReply: React.Dispatch<React.SetStateAction<boolean>>;
  className?: string;
}) => {
  const [replyText, setReplyText] = useState<string>("");

  const generateReplyId = () => {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomString}-${postId}`;
  };

  const handleComment = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_EXPRESS_API_URL as string}/posts/updateReplies`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          postId,
          commentId,
          replyId: generateReplyId(),
          replyText,
          user,
        }),
      },
    )
      .then((res) => res.json())
      .then((result) => {
        setComment(result.comments);
        setReplyText("");
      });
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      const replyElements = document.querySelectorAll(".reply-box");

      const clickedInsideAnyReply = Array.from(replyElements).some((el) =>
        el.contains(event.target as Node),
      );

      if (!clickedInsideAnyReply) {
        setShowReply(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className={className}>
      {showReply && (
        <div className="mb-8 flex items-center gap-5">
          <input
            type="text"
            className="input input-bordered w-2/3"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Add a reply..."
          />
          <button className="btn btn-primary" onClick={handleComment}>
            reply
          </button>
        </div>
      )}
    </div>
  );
};

export default PostReplies;
