import React from "react";
import { auth } from "../api/auth/nextAuth";
import { redirect } from "next/navigation";
import Login from "@/components/Login";
import Image from "next/image";

const page = async () => {
  const session = await auth();

  if (session?.user) {
    redirect("/");
  }
  return (
    <div className="grid h-[calc(100vh-12rem)] lg:h-[calc(100vh-100px)] place-items-center">
      <Image
        src="/login-background.jpg"
        alt="robot background"
        fill
        className="-z-10 object-cover"
      />
      <Login />
    </div>
  );
};

export default page;
