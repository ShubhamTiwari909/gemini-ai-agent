import { User } from "next-auth";

export type Poll = {
  _id?: string;
  question: {
    text: string;
    totalVotes?: number;
  };
  options: {
    answer: string;
    votes: {
      user?: User;
    }[];
    _id?: string;
  }[];
  createdAt?: Date;
};
