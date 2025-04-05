import React from "react";

const Search = ({
  setSearch,
}: {
  setSearch: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <input
      type="text"
      className="input input-bordered"
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search posts..."
    />
  );
};

export default Search;
