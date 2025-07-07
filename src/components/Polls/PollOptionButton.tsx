"use client";

import { User } from "next-auth";
import React from "react";

const PollOptionButton = ({
  onClick,
  type = "button",
  option,
}: {
  onClick?: () => void;
  type?: "button" | "submit";
  option: { answer: string; votes: { user?: User }[] };
}) => {
  return (
    <button
      type={type}
      className="cursor-pointer w-full btn btn-outline btn-secondary flex justify-between gap-5"
      onClick={onClick}
    >
      {option.answer}{" "}
      <span className="text-sm">{option.votes.length || 0} votes</span>
    </button>
  );
};

export default PollOptionButton;
