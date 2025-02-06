import React from "react";

const loading = () => {
  return (
    <section className="grid min-h-[calc(100vh-64px)] place-items-center px-5">
      <div className="bg-base-content w-full lg:w-sm lg:h-111 rounded-lg">
        <div className="skeleton w-full lg:w-90 lg:h-80 m-2.5"></div>
        <div className="p-6">
          <div className="skeleton w-full h-7 mb-1"></div>
          <div className="skeleton w-full h-5"></div>
        </div>
      </div>
    </section>
  );
};

export default loading;
