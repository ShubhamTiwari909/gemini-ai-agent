import { formatDate } from "@/lib/utils";
import { User } from "next-auth";
import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";
import PostViews from "../Gemini/ResponseRenderer/PostViews";
import { Posts } from "@/types/response-handlers";

const CardFooter = ({
  className,
  expressUrl,
  user,
  post,
}: {
  className?: string;
  expressUrl: string;
  user: User;
  post: Posts;
}) => {
  const heartColor = (likes: User[]) => {
    return likes.some((like: User) => like.email === user.email)
      ? "red"
      : "gray";
  };
  const [likesCount, setLikesCount] = useState<number>(post.likes.length);
  const [iconColor, setIconColor] = useState<string>(heartColor(post.likes));
  const handleLikes = () => {
    fetch(`${expressUrl}/posts/updateLikes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        postId: post.postId,
        user,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        setLikesCount(result.likes.length);
        setIconColor(heartColor(result.likes));
      });
  };

  return (
    <div
      className={`flex flex-wrap gap-y-5 justify-between items-center font-bold ${className}`}
    >
      <p className="text-xs">{formatDate(post.createdAt as string)}</p>
      <div className="flex flex-wrap items-center gap-5">
        <button
          className="flex items-center gap-x-2 cursor-pointer text-sm"
          onClick={handleLikes}
        >
          <FaHeart color={iconColor} /> {likesCount}
        </button>
        <PostViews
          expressUrl={process.env.NEXT_PUBLIC_EXPRESS_API_URL as string}
          postId={post?.postId as string}
          user={user}
          views={post.views as User[]}
        />
      </div>
    </div>
  );
};

export default CardFooter;
