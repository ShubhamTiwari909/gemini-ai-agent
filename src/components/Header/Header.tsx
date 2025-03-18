import React from "react";
import Modal from "../Theme/Modal";
import { auth } from "../../app/api/auth/nextAuth";
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
        </>
      ) : null}
      <Modal />
    </HeaderWrapper>
  );
};

export default Header;
