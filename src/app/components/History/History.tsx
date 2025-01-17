import React from "react";
import HistoryWrapper from "./HistoryWrapper";
import { auth } from "@/app/api/auth/nextAuth";

const History = async () => {
  const session = await auth();
  return (
    <div>
      <HistoryWrapper
        expressUrl={process.env.EXPRESS_API_URL || ""}
        email={session?.user?.email}
      />
    </div>
  );
};

export default History;
