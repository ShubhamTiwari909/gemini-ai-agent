"use client";
import React from "react";
import Image from "next/image";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import { Posts } from "@/types/response-handlers";
import NoPostFound from "../Feed/NoPostFound";
import { useInfiniteScrollingPost } from "@/lib/hooks/useInfiniteScrolling";

const ProfilePosts = ({
  posts,
  userId,
}: {
  posts: { data: Posts[]; hasMore: boolean };
  userId: string | null | undefined;
}) => {
  const { observerRef, loading, feed, page } = useInfiniteScrollingPost(
    () =>
      fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/posts/find`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
        },
        body: JSON.stringify({ userId, limit: 20, page: page + 1 }),
      }),
    posts,
  );

  if (posts.data.length === 0) {
    return <NoPostFound />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 w-full lg:w-fit xl:grid-cols-3 gap-5 lg:gap-8">
        {feed.length === 0 ? (
          <p>No searches found for the user</p>
        ) : (
          feed.map((item: Posts, index) => (
            <div
              key={item._id}
              ref={index === feed.length - 1 ? observerRef : null}
              className="mb-5 lg:w-80 bg-base-100 rounded-2xl p-5 border border-base-content text-white relative"
            >
              <Link
                href={`/post/${item._id}`}
                className="flex flex-col justify-between mb-2 size-full lg:max-w-80 lg:min-h-20 line-clamp-1 text-ellipsis relative z-10"
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
      <p className="text-center">{loading && "Loading..."}</p>
    </div>
  );
};

export default ProfilePosts;
