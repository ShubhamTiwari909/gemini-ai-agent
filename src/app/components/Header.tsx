import React from "react";
import Modal from "./Modal";
import LoginWithGithub from "./LoginWithGithub";
import { auth } from "../api/auth/nextAuth";
import Link from "next/link";
import HeaderWrapper from "./HeaderWrapper";

const Header = async () => {
  const session = await auth();

  return (
    <HeaderWrapper>
      <Link className="btn btn-primary btn-outline" href="/">
        Home
      </Link>
      <Modal />
      {session?.user ? (
        <Link className="btn btn-info btn-outline" href="/profile">
          Profile
        </Link>
      ) : (
        <LoginWithGithub />
      )}
    </HeaderWrapper>
  );
};

export default Header;
