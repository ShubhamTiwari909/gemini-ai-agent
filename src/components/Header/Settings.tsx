import React from "react";
import { MdSettings } from "react-icons/md";
import { RiListSettingsLine } from "react-icons/ri";
import Image from "next/image";
import { auth, signOut } from "../../app/api/auth/nextAuth";
import Link from "next/link";

const Settings = async () => {
  const session = await auth();
  return (
    <div className="lg:dropdown lg:dropdown-end text-base-content">
      <button
        tabIndex={0}
        className="m-1 cursor-pointer p-2 font-bold w-full text-center hidden lg:block"
      >
        <MdSettings
          size="1.5rem"
          className="text-base-content lg:text-base-300"
        />
      </button>
      <ul
        tabIndex={0}
        className="dropdown-content menu text-md max-h-75 [&_*]:w-full space-y-4 overflow-auto bg-base-200 text-white lg:bg-white lg:text-base-300 rounded-box z-1 w-full lg:w-40 p-4 shadow-sm"
      >
        <Link
          href="/settings"
          className="flex items-center justify-between gap-2"
        >
          <span>Settings</span> <RiListSettingsLine className="!size-5" />
        </Link>
        <hr className="border-t border-base-content" />
        <Link
          href="/profile"
          className="flex items-center justify-between gap-2"
        >
          <span>Profile</span>
          <Image
            width={20}
            height={20}
            src={session?.user.image || ""}
            alt={session?.user.name || ""}
            className="!w-fit rounded-full"
          />
        </Link>
        <hr className="border-t border-base-content" />
        <form
          action={async () => {
            "use server";
            await signOut();
          }}
        >
          <button
            type="submit"
            className="text-error text-left font-bold cursor-pointer"
          >
            Logout
          </button>
        </form>
      </ul>
    </div>
  );
};

export default Settings;
