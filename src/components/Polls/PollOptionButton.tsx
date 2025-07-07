"use client";

import { revalidatePage } from "@/actions/revalidatePolls";
import { User } from "next-auth";
import React from "react";

const updatePollVote = async (
  _id: string | undefined,
  user: User,
  optionId: string | undefined,
) => {
  await fetch(
    `${process.env.NEXT_PUBLIC_EXPRESS_API_URL as string}/polls/update/votes`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
      },
      body: JSON.stringify({
        _id,
        userVoted: user,
        optionId,
      }),
    },
  )
    .then((res) => {
      return res.json();
    })
    .then(async (data) => {
      if (data.message) {
        return;
      }
      console.log(data);
    });
  await revalidatePage("/polls");
};

const PollOptionButton = ({
  type = "button",
  option,
  pollId,
  user,
}: {
  type?: "button" | "submit";
  option: {
    answer: string;
    votes: { user?: User }[];
    _id?: string | undefined;
  };
  user: User;
  pollId?: string;
}) => {
  return (
    <button
      type={type}
      className="cursor-pointer w-full btn btn-outline btn-secondary flex justify-between gap-5"
      onClick={async () => await updatePollVote(pollId, user, option._id)}
    >
      {option.answer}{" "}
      <span className="text-sm">{option.votes.length || 0} votes</span>
    </button>
  );
};

export default PollOptionButton;
