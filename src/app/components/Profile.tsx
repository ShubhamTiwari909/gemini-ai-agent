import React from "react";
import { auth } from "../api/auth/nextAuth";
import Image from "next/image";

const Profile = async () => {
  const session = await auth();
  return (
    <div>
      <h2>User - {session?.user?.name}</h2>
      <p>Email - {session?.user?.email}</p>
      <Image
        src={session?.user?.image || ""}
        alt="Profile"
        width={100}
        height={100}
      />
    </div>
  );
};

export default Profile;
