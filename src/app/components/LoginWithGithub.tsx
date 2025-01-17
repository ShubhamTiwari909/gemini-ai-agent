import React from "react";
import { signIn } from "../api/auth/nextAuth";
import { FaGithub } from "react-icons/fa";

const LoginWithGithub = () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github");
      }}
    >
      <button type="submit" className="btn">
        Signin with GitHub <FaGithub />
      </button>
    </form>
  );
};

export default LoginWithGithub;
