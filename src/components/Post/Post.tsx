import React from "react";
import { auth } from "@/app/api/auth/nextAuth";
import { fetchUserByEmail } from "@/lib/utils";
import PostWrapper from "./PostWrapper";

export const fetchPosts = async (
  expressUrl: string,
  userId: string | null | undefined,
  limit?: number,
  page: number = 1,
) => {
  try {
    const response = await fetch(`${expressUrl}/posts/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ userId, limit, page }),
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
  const user = await fetchUserByEmail(session?.user?.email || "");

  const posts = await fetchPosts(
    process.env.EXPRESS_API_URL || "",
    user.userId,
    10,
  );
  return <PostWrapper posts={posts} userId={user.userId} />;
};

export default Posts;
