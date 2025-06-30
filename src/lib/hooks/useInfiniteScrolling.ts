import { Posts } from "@/types/response-handlers";
import { useEffect, useRef, useState } from "react";

export const useInfiniteScrollingPost = (
  api: () => Promise<Response>,
  posts: { data: Posts[]; hasMore: boolean },
) => {
  const [feed, setFeed] = useState(posts.data);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(posts.hasMore);
  const [loading, setLoading] = useState(false);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleFetch = () => {
    api()
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
        if (entries[0].isIntersecting && hasMore) {
          setLoading(true);
          handleFetch();
        }
      },
      { rootMargin: "0px" },
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [page, hasMore]); // Ensure effect runs when page updates

  return { feed, loading, observerRef, page };
};
