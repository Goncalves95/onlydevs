import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/prisma";
import type { PrismaClient } from "@/app/generated/prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // @auth/prisma-adapter expects the standard PrismaClient interface
  adapter: PrismaAdapter(prisma as unknown as PrismaClient),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Resend({
      from: process.env.RESEND_FROM_EMAIL ?? "noreply@onlydevs.com",
    }),
  ],
  callbacks: {
    session({ session, user }) {
      session.user.id = user.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
});
