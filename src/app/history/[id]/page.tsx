import HistoryPageWrapper from "@/components/History/HistoryPageWrapper";
import { notFound } from "next/navigation";
import React from "react";

const fetchHistoryById = async (
  expressUrl: string,
  id: string | null | undefined,
) => {
  try {
    const response = await fetch(`${expressUrl}/history/findById`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching history by ID:", error);
    return [];
  }
};
const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const activeHistory = await fetchHistoryById(
    process.env.EXPRESS_API_URL || "",
    id,
  );

  if (activeHistory.message) {
    notFound();
  }

  return <HistoryPageWrapper activeHistory={activeHistory} />;
};

export default page;
