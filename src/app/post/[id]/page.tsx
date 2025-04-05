import { auth } from "@/app/api/auth/nextAuth";
import PostPageWrapper from "@/components/Post/PostPageWrapper";
import { notFound } from "next/navigation";
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
      body: JSON.stringify({ id }),
      next: { revalidate: 60 * 60 },
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

  const activePost = await fetchPostById(process.env.EXPRESS_API_URL || "", id);

  if (activePost.message) {
    if (activePost.message.includes("domain")) {
      return (
        <div className="w-full h-screen grid place-items-center text-4xl">
          {activePost.message}
        </div>
      );
    }
    notFound();
  }

  return (
    <PostPageWrapper usermail={session?.user?.email} activePost={activePost} />
  );
};

export default page;
