// Server-only — imports Prisma. Never import this from middleware or Edge code.
import NextAuth, { CredentialsSignin } from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
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
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            emailVerified: true,
            role: true,
            password: true,
          },
        });

        if (!user) return null;

        // User exists but signed up via magic link / Google — give a specific error
        // so the UI can show a helpful message instead of a generic "wrong password".
        if (!user.password) throw new CredentialsSignin("no_password");

        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password
        );
        if (!valid) return null;

        // Never expose password hash in the returned user object
        const { password: _, ...safeUser } = user;
        return safeUser;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account, trigger }) {
      // account is only present on the initial sign-in, not on every session refresh
      if (account && user) {
        token.id = user.id;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        token.role = (user as any).role ?? "CUSTOMER";

        if (account.provider === "resend") {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: user.id as string },
              select: { password: true },
            });
            token.needsPassword = !dbUser?.password;
          } catch {
            // Don't block sign-in if the password check fails
            token.needsPassword = false;
          }
        }
      }

      // JWT update (triggered by useSession().update()) — clear flag once password is set
      if (trigger === "update" && token.needsPassword === true && token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id as string },
          select: { password: true },
        });
        if (dbUser?.password) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (token as any).needsPassword = undefined;
        }
      }

      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (session.user as any).role = token.role;
      if (token.needsPassword === true) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (session.user as any).needsPassword = true;
      }
      return session;
    },
  },
  debug: process.env.NODE_ENV === "development",
});
