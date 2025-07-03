import React from "react";
import Image from "next/image";
import { User } from "next-auth";
import { formatDate } from "@/lib/utils";

const ProfileUser = async ({ user }: { user: User | undefined }) => {
  return (
    <div className="flex flex-col bg-white shadow-sm border border-slate-200 rounded-lg w-full lg:w-96 lg:sticky lg:top-22">
      <div className="m-2.5 overflow-hidden rounded-md h-80 flex justify-center items-center">
        <Image
          className="w-full h-full object-cover"
          src={user?.image?.replace("s96", "s400") || ""}
          alt="profile-picture"
          width={400}
          height={400}
        />
      </div>
      <div className="p-6 text-center space-y-3">
        <h4 className="text-xl font-semibold text-slate-800">{user?.name}</h4>
        <p className="text-sm font-semibold text-slate-500 uppercase">
          {user?.email}
        </p>
        <p className="text-sm font-semibold text-slate-500">
          Joined at{" "}
          <span className="font-semibold">
            {formatDate(user?.createdAt.toString() || "")}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ProfileUser;
