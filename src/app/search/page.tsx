import FeedWrapper from "@/components/Feed/FeedWrapper";
import React from "react";
import { auth } from "../api/auth/nextAuth";
import { redirect } from "next/navigation";
import Search from "@/components/Feed/Search";

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const fetchFeed = async (
  limit: number,
  page: number,
  search: string | string[] | undefined,
) => {
  try {
    const response = await fetch(`${process.env.EXPRESS_API_URL}/feed/search`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        limit,
        page,
        search,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
};

const page = async ({ searchParams }: Props) => {
  const currSearchParams = await searchParams;
  const session = await auth();
  if (!session?.user) {
    // If the user is not logged in, redirect to the login page.
    redirect("/login");
  }
  const data = await fetchFeed(1, 1, currSearchParams.search);
  return (
    <div>
      <Search className="mb-10 pt-16 mx-auto max-w-7xl lg:px-0 lg:pt-10 px-5" />
      <FeedWrapper data={data} user={session?.user} />
    </div>
  );
};

export default page;
