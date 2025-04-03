import { formatDate } from "@/lib/utils";
import { History } from "@/types/response-handlers";
import React from "react";

const CardFooter = ({ post }: { post: History }) => {
  return (
    <div className="flex flex-wrap gap-y-5 justify-between items-center font-bold">
      <p className="text-xs text-base-content">
        {formatDate(post.createdAt as string)}
      </p>
    </div>
  );
};

export default CardFooter;
