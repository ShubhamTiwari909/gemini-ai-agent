import { Posts } from "@/types/response-handlers";
import React from "react";

const DeletePost = ({
  postId,
  setProfilePosts,
}: {
  postId: string;
  setProfilePosts: React.Dispatch<React.SetStateAction<Posts[]>>;
}) => {
  const handleDelete = async () => {
    fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/posts/delete`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ postId }),
    })
      .then((res) => res.json())
      .then(() => {
        setProfilePosts((prevPosts) =>
          prevPosts.filter((post) => post.postId !== postId),
        );
      });
  };
  return (
    <button
      className="p-2 text-xs rounded-lg text-base-300 font-semibold hover:bg-red-400 hover:text-white transition-colors duration-200"
      onClick={handleDelete}
    >
      Delete Post
    </button>
  );
};

export default DeletePost;
