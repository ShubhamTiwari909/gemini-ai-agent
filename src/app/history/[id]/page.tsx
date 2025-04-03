import { auth } from "@/app/api/auth/nextAuth";
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
        Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
      },
      body: JSON.stringify({ id }),
      next: { revalidate: 60 * 60 },
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
  const session = await auth();

  const activeHistory = await fetchHistoryById(
    process.env.EXPRESS_API_URL || "",
    id,
  );

  if (activeHistory.message) {
    if (activeHistory.message.includes("domain")) {
      return (
        <div className="w-full h-screen grid place-items-center text-4xl">
          {activeHistory.message}
        </div>
      );
    }
    notFound();
  }

  return (
    <HistoryPageWrapper
      usermail={session?.user?.email}
      activeHistory={activeHistory}
    />
  );
};

export default page;
