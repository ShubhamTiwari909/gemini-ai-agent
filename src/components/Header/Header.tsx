import React from "react";
import { auth } from "../../app/api/auth/nextAuth";
import Link from "next/link";
import HeaderWrapper from "./HeaderWrapper";
import Settings from "./Settings";

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
          <hr className="border-t border-base-white block lg:hidden" />
          <Settings />
        </>
      ) : null}
    </HeaderWrapper>
  );
};

export default Header;
