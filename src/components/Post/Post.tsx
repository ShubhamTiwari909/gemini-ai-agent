import React from "react";
import { auth } from "@/app/api/auth/nextAuth";
import { fetchUserId } from "@/lib/utils";
import PostWrapper from "./PostWrapper";

export const fetchPosts = async (
  expressUrl: string,
  email: string | null | undefined,
  userId: string | null | undefined,
  limit?: number,
) => {
  try {
    const response = await fetch(`${expressUrl}/posts/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ email, userId, limit, page: 1 }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching posts:", error);
    return [];
  }
};

const Posts = async () => {
  const session = await auth();
  const userId = await fetchUserId(session?.user?.email || "");

  const posts = await fetchPosts(
    process.env.EXPRESS_API_URL || "",
    session?.user?.email,
    userId,
    10,
  );
  return <PostWrapper posts={posts} user={session?.user} userId={userId} />;
};

export default Posts;
