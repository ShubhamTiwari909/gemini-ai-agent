import React from "react";
import ProfileUser from "../../components/Profile/ProfileUser";
import { auth } from "../api/auth/nextAuth";
import { redirect } from "next/navigation";
import { fetchPosts } from "@/components/Post/Post";
import ProfilePosts from "@/components/Profile/ProfilePosts";

const profile = async () => {
  const session = await auth();
  if (!session?.user) {
    // If the user is not logged in, redirect to the login page.
    redirect("/login");
  }
  const expressUrl = process.env.EXPRESS_API_URL || "";

  const posts = await fetchPosts(expressUrl, session?.user.userId, 20, 1);

  return (
    <section
      className={`grid min-h-[calc(100vh-64px)] px-5 pt-10 ${posts.length === 0 ? "place-items-center" : ""}`}
    >
      <div className="flex flex-wrap lg:flex-nowrap items-start justify-between gap-10">
        <ProfileUser user={session?.user} />
        <ProfilePosts
          posts={posts}
          userId={session?.user.userId}
          user={session?.user}
        />
      </div>
    </section>
  );
};

export default profile;
