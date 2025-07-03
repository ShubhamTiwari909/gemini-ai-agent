import { fetchUserByEmail } from "@/lib/utils";
import NextAuth, { User } from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

/**
 * Configuration for NextAuth authentication.
 * Sets up providers and handles user sign-in with additional user registration.
 */
export const { auth, handlers, signIn, signOut } = NextAuth({
  // Authentication providers
  providers: [
    GitHub, // GitHub provider for authentication
    Google, // Google provider for authentication
  ],
  // Secret key for encrypting session data
  secret: process.env.NEXTAUTH_SECRET,

  // Callback functions for various authentication events
  callbacks: {
    /**
     * Callback for user sign-in event.
     * Registers the user in an external system upon successful sign-in.
     *
     * @param user - The user object containing user information
     * @returns true if sign-in is successful
     */
    async signIn({ user }) {
      await addUsingUserToDb(user);
      return true;
    },
    session: async ({ session }) => {
      const user = await fetchUserByEmail(session?.user?.email as string);
      session.user.userId = user.userId;
      session.user.createdAt = user.createdAt;
      return session;
    },
  },
  trustHost: true,
});

const addUsingUserToDb = async (user: User) => {
  await fetch(`${process.env.EXPRESS_API_URL}/users/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.API_AUTH_TOKEN}`,
    },
    body: JSON.stringify({
      name: user?.name, // User's name
      email: user?.email, // User's email
      userId: `${user?.email?.split("@")[0]}${user.name?.toLocaleLowerCase().replace(/ /g, "_")}_${Array(
        6,
      )
        .fill(null)
        .map(() => String.fromCharCode(97 + Math.floor(Math.random() * 26)))
        .join("")}${Math.floor(Math.random() * 99999999)}`, // Randomly generated user ID with letters and numbers
      image: user?.image, // User's image
    }),
  });
};
