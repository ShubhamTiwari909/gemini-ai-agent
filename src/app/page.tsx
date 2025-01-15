import React from "react";
import ContentSummarizer from "./components/ContentSummarizer";

const page = () => {
  return (
    <section className="max-w-7xl mx-auto py-14 lg:py-20 px-5 lg:px-0">
      <h1 className="text-4xl lg:text-6xl text-center font-bold font-sans mb-10">Gemini AI Text Generator</h1>
      <ContentSummarizer />
    </section>
  );
};

export default page;
