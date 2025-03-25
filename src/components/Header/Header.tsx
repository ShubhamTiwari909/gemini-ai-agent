import React from "react";
import Modal from "../Theme/Modal";
import { auth, signOut } from "../../app/api/auth/nextAuth";
import Link from "next/link";
import HeaderWrapper from "./HeaderWrapper";

const Header = async () => {
  const session = await auth();
  return (
    <HeaderWrapper>
      {session?.user ? (
        <>
          <Link className="btn" href="/">
            Home
          </Link>
          <Link className="btn" href="/create-post">
            Create post
          </Link>
          <Link className="btn" href="/profile">
            Profile
          </Link>
          <Modal />
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button type="submit" className="btn btn-error">
              Logout
            </button>
          </form>
        </>
      ) : null}
    </HeaderWrapper>
  );
};

export default Header;
