// Server-only — imports Prisma. Never import this from middleware or Edge code.
import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import type { PrismaClient } from "@/lib/generated/prisma/client";

export const { handlers, auth, signIn, signOut } = NextAuth({
  // Spread pages + callbacks.authorized from the Edge config.
  // Do NOT spread providers — we define the full list here so that
  // adapter-required providers (Resend) are never included in the Edge bundle.
  ...authConfig,
  adapter: PrismaAdapter(prisma as unknown as PrismaClient),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Resend({
      apiKey: process.env.RESEND_API_KEY,
      from: process.env.RESEND_FROM_EMAIL ?? "onlydevs@resend.dev",
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role ?? "CUSTOMER";
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session.user as any).role = token.role;
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
});
