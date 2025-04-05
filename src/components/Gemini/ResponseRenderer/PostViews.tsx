import { User } from "next-auth";
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

const PostViews = ({
  expressUrl,
  postId,
  user,
  views,
}: {
  expressUrl: string;
  postId: string;
  user: User;
  views: User[];
}) => {
  const [viewsCount, setViewsCount] = useState<number>(views.length);
  const handleViews = () => {
    console.log("useEffect triggered");
    fetch(`${expressUrl}/posts/updateViews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        postId,
        user,
      }),
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.views) {
          console.log(result);
          setViewsCount(result.views.length);
        }
      });
  };
  useEffect(() => {
    handleViews();
  }, []);
  return (
    <p className="flex items-center gap-x-3 text-base-content">
      <FaEye color="cyan" /> {viewsCount}
    </p>
  );
};

export default PostViews;
