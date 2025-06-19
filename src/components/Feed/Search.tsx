"use client";
import Link from "next/link";
import React, { useState } from "react";

const Search = ({ className }: { className?: string }) => {
  const [search, setSearch] = useState("");

  // Update the search state when the input changes
  return (
    <div className={`flex gap-5 items-center w-full ${className}`}>
      <input
        className="input input-bordered w-full"
        type="text"
        value={search}
        placeholder="Search"
        onChange={(e) => setSearch(e.target.value)}
      />
      <Link
        href={`/search?search=${search}`}
        className="btn btn-primary btn-bordered xl:w-40"
      >
        Search
      </Link>
    </div>
  );
};

export default Search;
