import React from "react";
import Modal from "./Modal";
import Login from "./Login";
import { auth } from "../app/api/auth/nextAuth";
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
        <Login />
      )}
    </HeaderWrapper>
  );
};

export default Header;
