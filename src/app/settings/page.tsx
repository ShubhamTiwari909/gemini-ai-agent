import React from "react";
import ThemeModal from "../../components/Theme/Modal";
import { redirect } from "next/navigation";
import { auth, signOut } from "../api/auth/nextAuth";
import Modal from "@/components/Settings/Modal";

const page = async () => {
  const session = await auth();
  const userId = session?.user?.userId;
  console.log(session?.user?.userId);

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
        <Modal>
          <form
            action={async () => {
              "use server";
              const response = await fetch(
                `${process.env.EXPRESS_API_URL}/users/deleteAccount`,
                {
                  method: "DELETE",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
                  },
                  body: JSON.stringify({ userId }),
                },
              );
              if (response.ok) {
                await signOut();
              }
            }}
          >
            <button className="btn btn-error" type="submit">
              Delete Account
            </button>
          </form>
        </Modal>
      </div>
    </section>
  );
};

export default page;
