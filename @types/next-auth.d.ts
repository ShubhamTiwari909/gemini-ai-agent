import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      userId: string; // Unique identifier for the user
      createdAt: Date; // Timestamp of when the user was created
    } & DefaultSession["user"];
  }
  interface User {
    userId: string; // Unique identifier for the user
    createdAt: Date; // Timestamp of when the user was created
  }
}
