import { User } from "next-auth";

export type PollOption = {
  answer: string;
  votes: {
    user?: User;
  }[];
  _id?: string;
};

export type Poll = {
  _id?: string;
  question: {
    text: string;
    totalVotes?: number;
  };
  options: PollOption[];
  createdAt?: Date;
};
