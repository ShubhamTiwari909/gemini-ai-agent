import { formatDate } from "@/lib/utils";
import { History } from "@/types/response-handlers";
import Link from "next/link";
import React from "react";

const CardFooter = ({ post }: { post: History }) => {
  return (
    <div className="flex flex-wrap gap-y-5 justify-between items-center font-bold">
      <p className="text-xs text-base-content">
        {formatDate(post.createdAt as string)}
      </p>
      <Link
        href={`/users/${post.email}`}
        className="bg-base-content text-base-100 px-4 py-2 lg:px-6 rounded-full text-xs"
      >
        {post.username?.split(" ")[0]} {post.username?.split(" ")[1]}
      </Link>
    </div>
  );
};

export default CardFooter;
