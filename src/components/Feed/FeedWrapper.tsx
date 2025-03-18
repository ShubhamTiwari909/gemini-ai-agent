"use client";
import React, { useEffect, useRef, useState } from "react";
import { History } from "@/types/response-handlers";
import Link from "next/link";
import { formatDate } from "@/lib/utils";

type Data = {
  data: History[];
  currentPage: number;
  hasMore: boolean;
};

const FeedWrapper = ({ data }: { data: Data }) => {
  const [feed, setFeed] = useState(data.data);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(data.hasMore);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          // Ensure we have more data
          setLoading(true);
          fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/feed`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
            },
            body: JSON.stringify({
              limit: 3,
              page: page + 1,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              setLoading(false);
              setPage((prevPage) => prevPage + 1);
              setFeed((prevFeed) => [...prevFeed, ...result.data]);
              setHasMore(result.hasMore);
            })
            .catch((err) => console.error("Fetch error:", err));
        }
      },
      { rootMargin: "10px" },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [page, hasMore]); // Ensure effect runs when page updates

  return (
    <section className="min-h-screen px-5 py-16 mx-auto max-w-7xl lg:px-0 lg:py-10">
      <div className="grid grid-cols-1 text-white gap-12 lg:gap-10">
        {feed.map((post: History, index) => {
          return (
            <div
              key={post._id}
              ref={index === feed.length - 1 ? observerRef : null} // Attach ref to last item
              className="p-5 rounded-xl border border-base-content border-solid"
            >
              <Link href={`/history/${post._id}`}>
                <h2 className="mb-4 text-xl lg:text-2xl bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text font-extrabold text-transparent">
                  {post.prompt}
                </h2>
                <p className="mb-5 lg:mb-10 text-base-content">
                  {post.response.slice(0, 200)}...
                </p>
              </Link>
              <div className="flex flex-wrap gap-y-5 justify-between items-center font-bold">
                <p className="text-sm">
                  {formatDate(post.createdAt as string)}
                </p>
                <Link
                  href={`/users/${post.email}`}
                  className="bg-base-content text-base-100 px-4 py-2 lg:px-6 rounded-full text-sm"
                >
                  {post.username?.split(" ")[0]} {post.username?.split(" ")[1]}
                </Link>
              </div>
            </div>
          );
        })}
        <p className="text-center">{loading && "Loading..."}</p>
      </div>
    </section>
  );
};

export default FeedWrapper;
