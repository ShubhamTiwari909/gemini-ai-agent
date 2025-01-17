import React from "react";
import GeminiAiWrapper from "./components/Gemini/GeminiAiWrapper";
import History from "./components/History/History";
import { auth } from "./api/auth/nextAuth";

const page = async () => {
  const session = await auth();

  return (
    <section className="min-h-screen px-5 py-0 mx-auto max-w-7xl lg:px-0">
      <div>
        <h1 className="mb-10 font-sans text-4xl font-bold text-center lg:text-6xl">
          Gemini AI Text Generator
        </h1>
        <GeminiAiWrapper
          expressUrl={process.env.EXPRESS_API_URL || ""} // passing it from here as it is only available on server
          user={session?.user}
        />
      </div>
      <History />
    </section>
  );
};

export default page;
