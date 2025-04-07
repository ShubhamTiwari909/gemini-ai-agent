import { Comments } from "@/types/response-handlers";
import { User } from "next-auth";
import React, { useState } from "react";
import Comment from "./Comment";

const PostComments = ({
  user,
  postId,
  comments,
  className,
}: {
  user: User;
  postId: string;
  comments: Comments[] | undefined;
  className?: string;
}) => {
  const [comment, setComment] = useState(comments);
  const [commentText, setCommentText] = useState<string>("");

  const generateCommentId = () => {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomString}-${postId}`;
  };

  const handleComment = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_EXPRESS_API_URL as string}/posts/updateComments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          postId,
          commentId: generateCommentId(),
          commentText,
          user,
        }),
      },
    )
      .then((res) => res.json())
      .then((result) => {
        setComment(result.comments);
        setCommentText("");
      });
  };
  return (
    <div className={className}>
      <h2 className="text-base-content text-2xl font-semibold mb-5">
        Comments
      </h2>
      <div className="mb-8 flex items-center gap-5">
        <input
          type="text"
          className="input input-bordered w-2/3"
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          placeholder="Add a comment..."
        />
        <button className="btn btn-primary" onClick={handleComment}>
          comment
        </button>
      </div>
      <ul className="space-y-5">
        {comment?.map((comment) => {
          return (
            <Comment
              key={comment.id}
              comment={comment}
              user={user}
              postId={postId}
              setComment={setComment}
            />
          );
        })}
      </ul>
    </div>
  );
};

export default PostComments;
