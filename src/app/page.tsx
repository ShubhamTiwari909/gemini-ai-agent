import React, { Suspense } from "react";
import GeminiAiWrapper from ".././components/Gemini/GeminiAiWrapper";
import History from ".././components/History/History";
import { auth } from "./api/auth/nextAuth";
import { redirect } from "next/navigation";

/**
 * The main page of the application.
 * This page renders the Gemini AI Text Generator and the history component.
 * If the user is not logged in, it redirects to the login page.
 * @returns {React.ReactElement} The main page of the application.
 */
const page = async () => {
  const session = await auth();
  if (!session?.user) {
    // If the user is not logged in, redirect to the login page.
    redirect("/login");
  }
  return (
    <section className="min-h-screen px-5 py-0 mx-auto max-w-7xl lg:px-0 pt-10">
      <div>
        <h1 className="mb-10 font-sans text-4xl font-bold text-center lg:text-6xl pl-7">
          Gemini AI Zentauri
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
        />
      </div>
      <Suspense
        fallback={
          <div className="fixed left-0 top-20 lg:top-32 px-5">
            <p className="flex items-center">
              Loading history...
              <span className="animate-spin inline-block size-5 rounded-full border border-r-transparent border-solid border-current"></span>
            </p>
          </div>
        }
      >
        <History />
      </Suspense>
    </section>
  );
};

export default page;
