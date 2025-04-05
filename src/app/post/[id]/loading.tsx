import React from "react";

const loading = () => {
  return (
    <section className="relative py-16 lg:py-10 px-5 lg:px-10">
      <div className="skeleton absolute lg:right-8 lg:top-8 right-3 top-3 w-23 h-12"></div>
      <div className="skeleton h-18 lg:h-12 lg:w-[calc(100%-5.6rem)] w-full pt-20 mb-5"></div>
      <div className="skeleton h-18 lg:h-11 w-full lg:w-1/2 pt-20 mb-10"></div>
      <div className="skeleton h-[calc(100vh-24rem)] w-full"></div>
    </section>
  );
};

export default loading;
