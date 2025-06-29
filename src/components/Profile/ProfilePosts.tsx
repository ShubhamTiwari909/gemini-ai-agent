import React from "react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Posts } from "@/types/response-handlers";

const ProfilePosts = ({ posts }: { posts: { data: Posts[] } }) => {
  return (
    <div className="grid grid-cols-1 w-full lg:w-fit xl:grid-cols-3 gap-5 lg:gap-8">
      {posts.data.length === 0 ? (
        <p>No searches found for the user</p>
      ) : (
        posts.data.map((item: Posts) => (
          <div
            key={item._id}
            className="mb-5 lg:w-80 bg-base-100 rounded-2xl p-5 border border-base-content text-white relative"
          >
            <Link
              href={`/post/${item._id}`}
              className="flex flex-col justify-between mb-2 w-full lg:max-w-80 lg:min-h-20 line-clamp-1 text-ellipsis relative z-10"
            >
              <span className="inline-block mb-4 font-semibold w-fit">
                {item.prompt}
              </span>
              <span className="inline-block text-sm w-fit">
                {formatDate(item.createdAt as string)}
              </span>
            </Link>
            {item.responseType === "image" ? (
              <Image
                src={item.response}
                alt={item.prompt}
                fill
                className="z-0 opacity-40 rounded-2xl object-cover"
              />
            ) : null}
          </div>
        ))
      )}
    </div>
  );
};

export default ProfilePosts;
