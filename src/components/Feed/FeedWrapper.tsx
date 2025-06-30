"use client";
import React from "react";
import { Posts } from "@/types/response-handlers";
import Link from "next/link";
import Heading from "../Heading";
import NoPostFound from "./NoPostFound";
import Tags from "./Tags";
import Description from "./Description";
import CardFooter from "./CardFooter";
import CardHeader from "./CardHeader";
import { User } from "next-auth";
import { useInfiniteScrollingPost } from "@/lib/hooks/useInfiniteScrolling";
import { useSearchParams } from "next/navigation";

type Data = {
  data: Posts[];
  currentPage: number;
  hasMore: boolean;
};

const FeedWrapper = ({ data, user }: { data: Data; user: User }) => {
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const apiSlug = search ? "feed/search" : "feed";

  const { feed, loading, observerRef, page } = useInfiniteScrollingPost(
    () =>
      fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/${apiSlug}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          limit: 1,
          page: page + 1,
          search: search,
        }),
      }),
    data,
  );

  if (data.data.length === 0) {
    return <NoPostFound />;
  }

  return (
    <section className="min-h-screen px-5 py-16 mx-auto max-w-7xl lg:px-0 lg:py-10">
      <div className="grid grid-cols-1 text-white gap-12 lg:gap-10">
        {feed.map((post: Posts, index) => {
          return (
            <div
              key={post._id}
              data-id={index === feed.length - 1 ? "Last" : "Not last"}
              ref={index === feed.length - 1 ? observerRef : null} // Attach ref to last item
              className={`h-full p-5 rounded-xl border border-base-content border-solid flex flex-col justify-between relative overflow-hidden ${post.responseType === "image" || post.filePreview ? "" : "bg-base-300"}`}
            >
              <div>
                <CardHeader post={post} />
                <Link href={`/post/${post._id}`}>
                  <Heading
                    prompt={post.prompt || ""}
                    className={`mb-4 text-xl lg:text-2xl bg-gradient-to-r bg-clip-text font-extrabold text-transparent line-clamp-2 ${post.responseType === "image" || post.filePreview ? "from-pink-200 to-violet-200" : "from-pink-500 to-violet-500"}`}
                  />
                  <Tags tags={post.tags} />
                  <Description post={post} />
                </Link>
              </div>
              <CardFooter
                className={
                  post.filePreview || post.responseType === "image"
                    ? "text-white"
                    : "text-base-content"
                }
                user={user}
                post={post}
              />
            </div>
          );
        })}
        <p className="text-center">{loading && "Loading..."}</p>
      </div>
    </section>
  );
};

export default FeedWrapper;
