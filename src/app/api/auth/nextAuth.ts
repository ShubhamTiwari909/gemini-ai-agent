import NextAuth from "next-auth";
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
      await fetch(`${process.env.EXPRESS_API_URL}/users/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: user?.name, // User's name
          email: user?.email, // User's email
          userId: Math.floor(Math.random() * 999999099).toString(), // Randomly generated user ID
        }),
      });
      return true;
    },
  },
});
