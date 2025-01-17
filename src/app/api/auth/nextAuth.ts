import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { auth, handlers, signIn, signOut } = NextAuth({
  providers: [GitHub, Google],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session }) {
      await fetch(`${[process.env.EXPRESS_API_URL]}/users/add`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: session?.user?.name,
          email: session?.user?.email,
          userId: Math.floor(Math.random() * 999999099).toString(),
        }),
      });
      return session;
    },
  },
});
