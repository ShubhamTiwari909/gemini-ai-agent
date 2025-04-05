"use client";
import React, { useEffect, useRef, useState } from "react";
import { Posts } from "@/types/response-handlers";
import Link from "next/link";
import Search from "./Search";
import { useSearchParams } from "next/navigation";
import Heading from "../Heading";
import NoPostFound from "./NoPostFound";
import Tags from "./Tags";
import Description from "./Description";
import CardFooter from "./CardFooter";
import CardHeader from "./CardHeader";
import { User } from "next-auth";

type Data = {
  data: Posts[];
  currentPage: number;
  hasMore: boolean;
};

const FeedWrapper = ({
  data,
  expressUrl,
  user,
}: {
  data: Data;
  expressUrl: string;
  user: User;
}) => {
  const [feed, setFeed] = useState(data.data);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(data.hasMore);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();
  const search = searchParams.get("search");

  const handleFetch = () => {
    fetch(`${process.env.NEXT_PUBLIC_EXPRESS_API_URL}/feed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        limit: 3,
        page: page + 1,
        search: search,
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
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !search) {
          setLoading(true);
          handleFetch();
        }
      },
      { rootMargin: "10px" },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [page, hasMore, search]); // Ensure effect runs when page updates

  if (data.data.length === 0) {
    return <NoPostFound />;
  }

  return (
    <section className="min-h-screen px-5 py-16 mx-auto max-w-7xl lg:px-0 lg:py-10">
      <Search className="mb-10" />
      <div className="grid grid-cols-1 lg:grid-cols-3 text-white gap-12 lg:gap-10">
        {feed.map((post: Posts, index) => {
          return (
            <div
              key={post._id}
              data-id={index === feed.length - 1 ? "Last" : "Not last"}
              ref={index === feed.length - 1 ? observerRef : null} // Attach ref to last item
              className={`p-5 rounded-xl border border-base-content border-solid flex flex-col justify-between relative overflow-hidden ${post.responseType === "image" || post.filePreview?.includes("data:image") ? "" : "bg-base-300"}`}
            >
              <div>
                <CardHeader post={post} />
                <Link href={`/post/${post._id}`}>
                  <Heading
                    prompt={post.prompt || ""}
                    className={`mb-4 text-xl lg:text-2xl bg-gradient-to-r bg-clip-text font-extrabold text-transparent ${post.responseType === "image" || post.filePreview?.includes("data:image") ? "from-pink-200 to-violet-200" : "from-pink-500 to-violet-500"}`}
                  />
                  <Tags tags={post.tags} />
                  <Description post={post} />
                </Link>
              </div>
              <CardFooter
                className={
                  post.filePreview?.includes("data:image") ||
                  post.responseType === "image"
                    ? "text-white"
                    : "text-base-content"
                }
                expressUrl={expressUrl}
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
