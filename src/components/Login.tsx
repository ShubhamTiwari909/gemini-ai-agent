import React from "react";
import { signIn } from "../app/api/auth/nextAuth";
import { FaGithub, FaGoogle } from "react-icons/fa";

const Login = async () => {
  return (
    <div className="flex lg:flex-row flex-col gap-5">
      <form
        action={async () => {
          "use server";
          await signIn("google");
        }}
      >
        <button
          type="submit"
          className="btn btn-lg text-2xl bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:!text-white btn-outline w-full"
        >
          Signin with <FaGoogle />
        </button>
      </form>
      <form
        action={async () => {
          "use server";
          await signIn("github");
        }}
      >
        <button
          type="submit"
          className="btn btn-lg text-2xl bg-gradient-to-r from-slate-600 to-gray-700 text-white hover:!text-white btn-outline w-full"
        >
          Signin with <FaGithub />
        </button>
      </form>
    </div>
  );
};

export default Login;
