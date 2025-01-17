"use client";
import React from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const History = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className="fixed top-20 lg:top-32 left-0 w-full lg:max-w-96">
      {!isOpen ? (
        <button
          className="btn btn-info absolute left-5 z-30"
          onClick={() => setIsOpen(true)}
        >
          <FaArrowRight />
        </button>
      ) : null}
      <div
        className={`h-[500px] bg-base-300 rounded-xl transition-all duration-150 ease-in-out p-5 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <button
          className="btn btn-info absolute right-5 z-30"
          onClick={() => setIsOpen(false)}
        >
          <FaArrowLeft />
        </button>
        <ul className="h-full overflow-auto py-5">
          {[...Array(30)].map((_, index) => {
            return <li key={index}>{index + 1}</li>;
          })}
        </ul>
      </div>
    </div>
  );
};

export default History;
