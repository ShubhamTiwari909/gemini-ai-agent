import { auth } from "@/app/api/auth/nextAuth";
import PostPageWrapper from "@/components/Post/PostPageWrapper";
import { User } from "next-auth";
import { notFound, redirect } from "next/navigation";
import React from "react";

const fetchPostById = async (
  expressUrl: string,
  id: string | null | undefined,
) => {
  try {
    const response = await fetch(`${expressUrl}/posts/findById`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ id, limit: 20, skip: 0 }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching posts by ID:", error);
    return [];
  }
};
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) {
    // If the user is not logged in, redirect to the login page.
    redirect("/login");
  }

  const post = await fetchPostById(process.env.EXPRESS_API_URL || "", id);

  if (post.message) {
    if (post.message.includes("domain")) {
      return (
        <div className="w-full h-screen grid place-items-center text-4xl">
          {post.message}
        </div>
      );
    }
    notFound();
  }

  return (
    <PostPageWrapper
      user={session?.user as User}
      usermail={session?.user?.email}
      post={post}
    />
  );
};

export default page;
