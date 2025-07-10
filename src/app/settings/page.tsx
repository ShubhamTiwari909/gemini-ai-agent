import React from "react";
import ThemeModal from "../../components/Theme/Modal";
import { redirect } from "next/navigation";
import { auth } from "../api/auth/nextAuth";
import DeleteAccount from "@/components/Settings/DeleteAccount";
import DeleteAllPosts from "@/components/Settings/DeleteAllPosts";

const page = async () => {
  const session = await auth();
  const userId = session?.user?.userId;

  if (session === null || !session?.user?.email) {
    redirect("/login");
  }
  return (
    <section className="min-h-[calc(100vh-64px)] px-5 relative pt-10 lg:px-20">
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="mt-4">Manage your account settings here.</p>
      </div>

      <div className="space-y-5">
        <ThemeModal />
        <div className="flex items-center gap-5">
          <DeleteAccount
            userId={userId || ""}
            email={session?.user?.email || ""}
          />
          <DeleteAllPosts
            userId={userId || ""}
            apiAuthToken={process.env.API_AUTH_TOKEN || ""}
            expressUrl={process.env.EXPRESS_API_URL || ""}
          />
        </div>
      </div>
    </section>
  );
};

export default page;
