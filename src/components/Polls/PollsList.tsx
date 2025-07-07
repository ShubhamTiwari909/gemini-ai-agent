import { revalidatePage } from "@/actions/revalidatePolls";
import { auth } from "@/app/api/auth/nextAuth";
import { Poll } from "@/types/polls";
import { User } from "next-auth";
import React from "react";
import PollOptionButton from "./PollOptionButton";
import Voters from "./Voters";

const updatePollVote = async (
  _id: string | undefined,
  user: User,
  optionId: string | undefined,
) => {
  const response = await fetch(
    `${process.env.EXPRESS_API_URL as string}/polls/update/votes`,
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
  );
  if (!response.ok) {
    throw new Error("Failed to fetch polls");
  }
  await revalidatePage("/polls");
};

const PollsList = async ({ polls }: { polls: Poll[] }) => {
  const session = await auth();
  const user = session?.user;
  return (
    <div className="space-y-15">
      {polls.map((poll: Poll) => (
        <div
          key={poll._id}
          className="p-4 rounded-xl border border-base-content shadow-sm shadow-white/30 "
        >
          <h3 className="mb-5 font-semibold text-lg">{poll.question.text}</h3>
          <ul className="space-y-3">
            {poll.options.map((option) => (
              <li key={option._id}>
                <form
                  action={async () => {
                    "use server";
                    await updatePollVote(poll._id, user as User, option._id);
                  }}
                  className="relative"
                >
                  <PollOptionButton type="submit" option={option} />
                  <Voters voters={option.votes} />
                </form>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PollsList;
