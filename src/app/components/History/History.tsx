import React from "react";
import HistoryWrapper from "./HistoryWrapper";
import { auth } from "@/app/api/auth/nextAuth";

const fetchHistoryFromDb = async (email: string | null | undefined) => {
  const response = await fetch(`${process.env.EXPRESS_API_URL}/history/find`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
  const data = await response.json();
  return data;
};

const History = async () => {
  const session = await auth();
  const history = await fetchHistoryFromDb(session?.user?.email);
  return (
    <div>
      <HistoryWrapper history={history} />
    </div>
  );
};

export default History;
