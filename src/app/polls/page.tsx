import CreatePoll from "@/components/Polls/CreatePoll";
import React from "react";
import { auth } from "../api/auth/nextAuth";
import PollsList from "@/components/Polls/PollsList";

const fetchPolls = async () => {
  const response = await fetch(
    `${process.env.EXPRESS_API_URL as string}/polls`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_API_AUTH_TOKEN}`,
      },
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch polls");
  }
  return response.json();
};

const page = async () => {
  const session = await auth();
  const polls = await fetchPolls();
  return (
    <section className="min-h-screen px-5 py-0 mx-auto max-w-3xl lg:px-0 pt-10">
      <CreatePoll user={session?.user} />
      <PollsList polls={polls} />
    </section>
  );
};

export default page;
