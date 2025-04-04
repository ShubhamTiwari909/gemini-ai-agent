import React from "react";

const Tags = ({ tags }: { tags: string[] }) => {
  return (
    <ul className="mb-8 flex flex-wrap gap-5">
      {tags.map((tag: string, index: number) => (
        <li
          key={index}
          className="inline-block px-2 py-1 mr-2 text-xs font-semibold text-base-100 bg-base-content rounded-full"
        >
          #{tag}
        </li>
      ))}
    </ul>
  );
};

export default Tags;
