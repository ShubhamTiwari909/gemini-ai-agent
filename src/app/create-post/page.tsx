import React, { Suspense } from "react";
import GeminiAiWrapper from "../.././components/Gemini/GeminiAiWrapper";
import Post from "../../components/Post/Post";
import { auth } from ".././api/auth/nextAuth";
import { redirect } from "next/navigation";
import { fetchUserId } from "@/lib/utils";

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
  const userId = await fetchUserId(session?.user?.email || "");
  const apiAuthToken = process.env.API_AUTH_TOKEN;
  return (
    <section className="min-h-screen px-5 py-0 mx-auto max-w-7xl lg:px-0 pt-10">
      <div>
        <h1 className="mb-10 font-sans text-4xl font-bold text-center lg:text-6xl pl-7">
          Gemini Zentauri
        </h1>
        <GeminiAiWrapper
          /**
           * The URL of the Express.js server.
           * This is only available on the server.
           */
          expressUrl={process.env.EXPRESS_API_URL || ""}
          /**
           * The user object from the session.
           * This is only available if the user is logged in.
           */
          user={session?.user}
          apiAuthToken={apiAuthToken || ""}
          userId={userId || ""}
        />
      </div>
      <Suspense
        fallback={
          <div className="fixed left-0 top-20 lg:top-32 px-5">
            <p className="flex items-center">
              Loading posts...
              <span className="animate-spin inline-block size-5 rounded-full border border-r-transparent border-solid border-current"></span>
            </p>
          </div>
        }
      >
        <Post />
      </Suspense>
    </section>
  );
};

export default page;
