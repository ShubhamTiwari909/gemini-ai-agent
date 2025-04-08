import { Comments } from "@/types/response-handlers";
import { User } from "next-auth";
import React, { useState } from "react";
import Comment from "./Comment";

const PostComments = ({
  user,
  postId,
  comments,
  commentsLength,
  className,
}: {
  user: User;
  postId: string;
  comments: Comments[] | undefined;
  commentsLength: number;
  className?: string;
}) => {
  const [comment, setComment] = useState<Comments[] | undefined>(comments);
  const [commentText, setCommentText] = useState<string>("");
  const [limit, setLimit] = useState(40);
  const [hasMore, setHasMore] = useState(commentsLength < 21 ? false : true);
  const [localComments, setLocalComments] = useState<Comments[] | undefined>(
    [],
  );

  const generateCommentId = () => {
    const timestamp = Date.now().toString();
    const randomString = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomString}-${postId}`;
  };
  const handleCommentsByLimit = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_EXPRESS_API_URL as string}/posts/fetchComments`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          postId,
          limit: limit,
          skip: limit - 20,
          localComments,
        }),
      },
    )
      .then((res) => res.json())
      .then(
        (result: {
          comments: Comments[] | undefined;
          limit: number;
          hasMore: boolean;
        }) => {
          setComment((prev) => [...prev!, ...result.comments!]);
          setLimit(result.limit);
          setHasMore(result.hasMore);
        },
      );
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
      .then(
        (result: {
          comment: Comments[] | undefined;
          commentsLength: number;
        }) => {
          if (result?.comment) {
            setComment((prev) => [...new Set([...result.comment!, ...prev!])]);
            setHasMore(result?.commentsLength < 21 ? false : true);
            setLocalComments((prev) => [...prev!, ...result.comment!]);
          }
          setCommentText("");
        },
      );
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
              limit={limit}
            />
          );
        })}
      </ul>
      {hasMore && (
        <button
          onClick={() => {
            handleCommentsByLimit();
          }}
          className="btn btn-bordered"
        >
          More comments
        </button>
      )}
    </div>
  );
};

export default PostComments;
