import React from "react";
import Profile from "../../components/Profile";
import { auth } from "../api/auth/nextAuth";
import { redirect } from "next/navigation";

const profile = async () => {
  const session = await auth();
  if (!session?.user) {
    // If the user is not logged in, redirect to the login page.
    redirect("/login");
  }
  return (
    <section className="grid min-h-[calc(100vh-64px)] place-items-center px-5">
      <Profile user={session?.user} />
    </section>
  );
};

export default profile;
