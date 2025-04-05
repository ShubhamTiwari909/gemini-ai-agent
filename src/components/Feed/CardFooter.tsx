import { formatDate } from "@/lib/utils";
import { User } from "next-auth";
import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";

const CardFooter = ({
  createdAt,
  className,
  expressUrl,
  historyId,
  user,
  likes,
}: {
  createdAt: string;
  className?: string;
  expressUrl: string;
  historyId: string;
  user: User;
  likes: User[];
}) => {
  const heartColor = (likes: User[]) => {
    return likes.some((like: User) => like.email === user.email)
      ? "red"
      : "gray";
  };
  const [likesCount, setLikesCount] = useState<number>(likes.length);
  const [iconColor, setIconColor] = useState<string>(heartColor(likes));
  const handleLikes = () => {
    fetch(`${expressUrl}/history/updateLikes`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        historyId,
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
      <p className="text-xs">{formatDate(createdAt as string)}</p>
      <button
        className="flex items-center gap-x-2 cursor-pointer text-sm"
        onClick={handleLikes}
      >
        <FaHeart color={iconColor} /> {likesCount}
      </button>
    </div>
  );
};

export default CardFooter;
