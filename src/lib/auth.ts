import { PrismaAdapter } from "@auth/prisma-adapter";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import NextAuth from "next-auth";
import { prisma } from "./prisma";
import Credentials from "next-auth/providers/credentials";
// Your own logic for dealing with plaintext password strings; be careful!
//import { saltAndHashPassword } from "@/utils/password"

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub,
    Google,
    // Credentials({
    //   // You can specify which fields should be submitted, by adding keys to the `credentials` object.
    //   // e.g. domain, username, password, 2FA token, etc.
    //   credentials: {
    //     email: {},
    //     password: {},
    //   },
    //   authorize: async (credentials) => {
    //     let user = null;

    //     // logic to salt and hash password
    //     //const pwHash = saltAndHashPassword(credentials.password)

    //     // logic to verify if user exists
    //     //user = await getUserFromDb(credentials.email, pwHash)

    //     if (!user) {
    //       // No user found, so this is their first attempt to login
    //       // meaning this is also the place you could do registration
    //       throw new Error("User not found.");
    //     }

    //     // return user object with the their profile data
    //     return user;
    //   },
    // }),
  ],
  pages: {
    signIn: "/signin",
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const email = user.email;
      // Check if a user with this email already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: email },
      });

      if (existingUser && account != null) {
        // If a user exists, link the OAuth account to this user
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: account.provider,
              providerAccountId: account.providerAccountId,
            },
          },
          update: {
            refresh_token: account.refresh_token,
            access_token: account.access_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            //session_state: account.session_state,
          },
          create: {
            userId: existingUser.id,
            type: "oauth", // Utilisation d'un type défini dans votre modèle Account
            provider: account.provider,
            providerAccountId: account.providerAccountId,
            refresh_token: account.refresh_token,
            access_token: account.access_token,
            expires_at: account.expires_at,
            token_type: account.token_type,
            scope: account.scope,
            id_token: account.id_token,
            //session_state: account.session_state,
          },
        });
        return true;
      }

      return true;
    },
    async session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
});
