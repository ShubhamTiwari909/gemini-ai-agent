import React from "react";
import { auth } from "./api/auth/nextAuth";
import { redirect } from "next/navigation";
import FeedWrapper from "@/components/Feed/FeedWrapper";

const fetchFeed = async (limit: number, page: number) => {
  try {
    const response = await fetch(`${process.env.EXPRESS_API_URL}/feed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        limit,
        page,
      }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user ID:", error);
    return null;
  }
};

/**
 * The main page of the application.
 * This page renders the Gemini AI Text Generator and the post component.
 * If the user is not logged in, it redirects to the login page.
 * @returns {React.ReactElement} The main page of the application.
 */
const page = async () => {
  const session = await auth();
  if (!session?.user) {
    // If the user is not logged in, redirect to the login page.
    redirect("/login");
  }
  const data = await fetchFeed(3, 1);
  return <FeedWrapper data={data} user={session?.user} />;
};

export default page;
