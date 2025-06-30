import { redirect } from "next/navigation";
import React from "react";

const Search = async ({ className }: { className?: string }) => {
  const handleSubmit = async (formData: FormData) => {
    "use server";
    const searchQuery = formData.get("search") as string;
    const searchParams = new URLSearchParams();
    searchParams.set("search", searchQuery);
    // You can revalidate a dynamic route or fixed path
    redirect(`/search?search=${searchParams.get("search")}`); // 'page' ensures it revalidates the route
  };

  return (
    <form
      action={handleSubmit}
      className={`flex gap-5 items-center w-full ${className}`}
    >
      <input
        className="input input-bordered w-full"
        type="text"
        name="search"
        placeholder="Search"
      />
      <button type="submit" className="btn btn-primary btn-bordered xl:w-40">
        Search
      </button>
    </form>
  );
};

export default Search;
