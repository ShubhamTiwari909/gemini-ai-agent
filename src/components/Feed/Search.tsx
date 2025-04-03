"use client";
import React, { useState } from "react";

const Search = ({ className }: { className?: string }) => {
  const [search, setSearch] = useState("");

  const handleNavigation = () => {
    window.location.href = `/search?search=${search}`; // Navigate to the page
  };
  return (
    <div className={`flex gap-5 items-center w-full ${className}`}>
      <input
        className="input input-bordered w-full"
        type="text"
        value={search}
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />
      <button
        className="btn btn-primary btn-bordered xl:w-40"
        onClick={handleNavigation}
      >
        Search
      </button>
    </div>
  );
};

export default Search;
