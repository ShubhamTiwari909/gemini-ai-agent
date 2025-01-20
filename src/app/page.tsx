import React from "react";
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
    <section className="min-h-screen px-5 py-0 mx-auto max-w-7xl lg:px-0">
      <div>
        <h1 className="mb-10 font-sans text-4xl font-bold text-center lg:text-6xl">
          Gemini AI Text Generator
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
      <History />
    </section>
  );
};

export default page;
