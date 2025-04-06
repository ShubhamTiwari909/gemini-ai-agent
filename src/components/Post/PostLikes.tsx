import { User } from "next-auth";
import React, { useState } from "react";
import { FaHeart } from "react-icons/fa";

const PostLikes = ({
  user,
  postId,
  postLikes,
}: {
  user: User;
  postId: string;
  postLikes: User[];
}) => {
  const heartColor = (likes: User[]) => {
    return likes.some((like: User) => like.email === user.email)
      ? "red"
      : "gray";
  };
  const [likesCount, setLikesCount] = useState<number>(postLikes.length);
  const [iconColor, setIconColor] = useState<string>(heartColor(postLikes));
  const handleLikes = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_EXPRESS_API_URL as string}/posts/updateLikes`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          postId,
          user,
        }),
      },
    )
      .then((res) => res.json())
      .then((result) => {
        setLikesCount(result.likes.length);
        setIconColor(heartColor(result.likes));
      });
  };
  return (
    <div>
      <button
        className="flex items-center gap-x-2 cursor-pointer text-sm"
        onClick={handleLikes}
      >
        <FaHeart color={iconColor} /> {likesCount}
      </button>
    </div>
  );
};

export default PostLikes;
