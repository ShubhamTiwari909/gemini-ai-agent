"use client";
import React, { useState } from "react";
import { Posts } from "@/types/response-handlers";
import NoPostFound from "../Feed/NoPostFound";
import { useInfiniteScrollingPost } from "@/lib/hooks/useInfiniteScrolling";
import ProfileCard from "./ProfileCard";
import { User } from "next-auth";

const ProfilePosts = ({
  posts,
  userId,
  user,
}: {
  posts: { data: Posts[]; hasMore: boolean };
  userId: string | null | undefined;
  user: User;
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

  const [profilePosts, setProfilePosts] = useState<Posts[]>(feed);

  if (posts.data.length === 0) {
    return <NoPostFound />;
  }

  return (
    <div>
      <div className="grid grid-cols-1 w-full lg:w-fit xl:grid-cols-2 gap-5 lg:gap-8">
        {profilePosts.length === 0 ? (
          <p>No searches found for the user</p>
        ) : (
          profilePosts.map((item: Posts, index) => (
            <ProfileCard
              user={user}
              item={item}
              index={index}
              feedLength={profilePosts.length}
              observerRef={observerRef}
              setProfilePosts={setProfilePosts}
              key={index}
            />
          ))
        )}
      </div>
      <p className="text-center">{loading && "Loading..."}</p>
    </div>
  );
};

export default ProfilePosts;
