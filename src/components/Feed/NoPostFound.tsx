import React from "react";
import Search from "./Search";

const NoPostFound = () => {
  return (
    <section className="min-h-screen px-5 py-16 mx-auto max-w-7xl lg:px-0 lg:py-10">
      <div className="mb-10">
        <Search />
      </div>
      <div className="grid place-items-center h-screen">
        <p className="text-2xl lg:text-5xl">No posts found</p>
      </div>
    </section>
  );
};

export default NoPostFound;
