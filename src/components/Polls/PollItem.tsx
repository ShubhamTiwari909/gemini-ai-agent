import React from "react";
import PollOptionButton from "./PollOptionButton";
import Voters from "./Voters";
import { PollOption } from "@/types/polls";
import { User } from "next-auth";

const PollItem = ({
  option,
  pollId,
  user,
}: {
  option: PollOption;
  pollId: string | undefined;
  user: User;
}) => {
  return (
    <li key={option._id}>
      <PollOptionButton
        type="submit"
        option={option}
        pollId={pollId}
        user={user as User}
      />
      <Voters voters={option.votes} />
    </li>
  );
};

export default PollItem;
