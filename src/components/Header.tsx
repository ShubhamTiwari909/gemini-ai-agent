import React from "react";
import Modal from "./Theme/Modal";
import { auth } from "../app/api/auth/nextAuth";
import Link from "next/link";
import HeaderWrapper from "./HeaderWrapper";

const Header = async () => {
  const session = await auth();
  return (
    <HeaderWrapper>
      {session?.user ? (
        <>
          {" "}
          <Link className="btn btn-primary btn-outline" href="/">
            Home
          </Link>
          <Link className="btn btn-info btn-outline" href="/profile">
            Profile
          </Link>
        </>
      ) : null}
      <Modal />
    </HeaderWrapper>
  );
};

export default Header;
