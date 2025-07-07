import { auth } from "@/app/api/auth/nextAuth";
import { Poll } from "@/types/polls";
import { User } from "next-auth";
import React from "react";
import PollItem from "./PollItem";

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
              <PollItem
                key={option._id}
                option={option}
                pollId={poll._id}
                user={user as User}
              />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PollsList;
