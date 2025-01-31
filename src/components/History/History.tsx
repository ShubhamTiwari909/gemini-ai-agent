import React from "react";
import HistoryWrapper from "./HistoryWrapper";
import { auth } from "@/app/api/auth/nextAuth";

export const fetchHistory = async (
  expressUrl: string,
  email: string | null | undefined,
) => {
  try {
    const response = await fetch(`${expressUrl}/history/find`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching history:", error);
    return [];
  }
};

const History = async () => {
  const session = await auth();
  const history = await fetchHistory(
    process.env.EXPRESS_API_URL || "",
    session?.user?.email,
  );
  return <HistoryWrapper history={history} />;
};

export default History;
