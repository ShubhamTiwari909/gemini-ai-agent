import { compactNumberFormat } from "@/lib/utils";
import { User } from "next-auth";
import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";

const PostViews = ({
  postId,
  user,
  views,
}: {
  postId: string;
  user: User;
  views: User[];
}) => {
  const [viewsCount, setViewsCount] = useState<number>(views.length);
  const handleViews = () => {
    fetch(
      `${process.env.NEXT_PUBLIC_EXPRESS_API_URL as string}/posts/updateViews`,
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
        if (result.views) {
          setViewsCount(result.views.length);
        }
      });
  };
  useEffect(() => {
    handleViews();
  }, []);
  return (
    <p className="flex items-center gap-x-2 text-white text-sm">
      <FaEye color="cyan" /> {compactNumberFormat(viewsCount)}
    </p>
  );
};

export default PostViews;
