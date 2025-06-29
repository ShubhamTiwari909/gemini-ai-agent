import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userId: string; // Unique identifier for the user
    } & DefaultSession["user"];
  }
  interface User {
    userId: string; // Unique identifier for the user
  }
}
