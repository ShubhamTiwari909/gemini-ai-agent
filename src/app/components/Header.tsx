import React from "react";
import Modal from "./Modal";
import LoginWithGithub from "./LoginWithGithub";
import { auth } from "../api/auth/nextAuth";
import Link from "next/link";

const Header = async () => {
  const session = await auth();

  return (
    <header className="flex justify-end gap-5 py-5 px-10">
      <Modal />
      <Link className="btn" href="/">Home</Link>
      {session?.user ? <Link className="btn" href="/profile">Profile</Link> : <LoginWithGithub />}
    </header>
  );
};

export default Header;
