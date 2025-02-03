"use client";
import React from "react";
import Image from "next/image";
import { User } from "next-auth";

const Profile = async ({ user }: { user: User | undefined }) => {
  return (
    <div className="flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-full lg:w-96">
      <div className="m-2.5 overflow-hidden rounded-md h-80 flex justify-center items-center">
        <Image
          className="w-full h-full object-cover"
          src={user?.image || ""}
          alt="profile-picture"
          width={500}
          height={500}
        />
      </div>
      <div className="p-6 text-center">
        <h4 className="mb-1 text-xl font-semibold text-slate-800">
          {user?.name}
        </h4>
        <p className="text-sm font-semibold text-slate-500 uppercase">
          {user?.email}
        </p>
      </div>
    </div>
  );
};

export default Profile;
