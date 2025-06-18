import React from "react";

const Loading = () => {
  return (
    <section className="min-h-screen px-5 py-0 mx-auto max-w-7xl lg:px-0 pt-10">
      <div>
        <div className="skeleton h-20 lg:h-15 w-full mb-10"></div>
        <div className="skeleton h-57 w-full mb-6 lg:mb-10"></div>
        <div className="flex flex-wrap gap-5 items-center justify-center lg:gap-10">
          <div className="skeleton h-12 w-39 mb-6 lg:mb-10"></div>
          <div className="skeleton h-12 w-39 mb-6 lg:mb-10"></div>
          <div className="skeleton h-34 w-87 mb-6 lg:mb-10"></div>
        </div>
        <div className="skeleton z-30 left-2 top-36 w-11 h-8 lg:w-15 lg:h-10 hidden lg:fixed"></div>
      </div>
    </section>
  );
};

export default Loading;
