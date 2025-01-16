import React from "react";
import GeminiAiWrapper from "./components/Gemini/GeminiAiWrapper";

const page = async () => {

  return (
    <main className="max-w-7xl mx-auto py-14 px-5 lg:px-0 min-h-screen">
      <h1 className="text-4xl lg:text-6xl text-center font-bold font-sans mb-10">
        Gemini AI Text Generator
      </h1>
      <GeminiAiWrapper />
    </main>
  );
};

export default page;
