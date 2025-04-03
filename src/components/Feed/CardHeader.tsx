import { History } from "@/types/response-handlers";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const CardHeader = ({ post }: { post: History }) => {
  return (
    <Link
      href={`/users/${post.user.email}`}
      className="pb-4 rounded-full text-sm flex items-center gap-4 w-fit"
    >
      <Image
        src={post.user.image || ""}
        alt="alt"
        width={35}
        height={35}
        className="rounded-full outline-2 outline-base-content outline-solid outline-offset-3"
      />
      <span>
        {post.user.name?.split(" ")[0]} {post.user.name?.split(" ")[1]}
      </span>
    </Link>
  );
};

export default CardHeader;
