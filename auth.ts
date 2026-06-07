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

console.log("[auth-debug] MODULE LOAD — AUTH_SECRET present:", !!process.env.AUTH_SECRET);
console.log("[auth-debug] AUTH_URL:", process.env.AUTH_URL ?? "(not set)");
console.log("[auth-debug] NEXTAUTH_SECRET present:", !!process.env.NEXTAUTH_SECRET);
console.log("[auth-debug] NEXTAUTH_URL:", process.env.NEXTAUTH_URL ?? "(not set)");
console.log("[auth-debug] NODE_ENV:", process.env.NODE_ENV);

function initNextAuth() {
  try {
    return NextAuth({
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

            console.log("[credentials] user found:", !!user);
            console.log("[credentials] has password:", !!user?.password);
            if (!user) return null;

            // User exists but signed up via magic link / Google — give a specific error
            // so the UI can show a helpful message instead of a generic "wrong password".
            if (!user.password) throw new CredentialsSignin("no_password");

            const valid = await bcrypt.compare(
              credentials.password as string,
              user.password
            );
            console.log("[credentials] bcrypt result:", valid);
            if (!valid) return null;

            // Never expose password hash in the returned user object
            const { password: _, ...safeUser } = user;
            return safeUser;
          },
        }),
      ],
      callbacks: {
        async jwt({ token, user, account, trigger }) {
          console.log("[jwt] called, user present:", !!user);
          console.log("[jwt] account provider:", account?.provider);
          // user is only present on the initial sign-in, not on session refreshes
          if (user) {
            console.log("[jwt] setting token.id:", user.id);
            token.id = user.id as string;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            token.role = (user as any).role ?? "CUSTOMER";
          }

          // Magic-link sign-in — flag if the user has no password so we can prompt setup
          if (account?.provider === "resend" && user) {
            try {
              const dbUser = await prisma.user.findUnique({
                where: { id: user.id as string },
                select: { password: true },
              });
              console.log("[jwt] needsPassword check:", !dbUser?.password);
              token.needsPassword = !dbUser?.password;
            } catch (e) {
              console.error("[jwt] prisma error:", e);
              // Don't block sign-in if the password check fails
              token.needsPassword = false;
            }
          }

          // JWT update (triggered by useSession().update()) — clear flag once password is set
          if (trigger === "update" && token.needsPassword === true && token.id) {
            const dbUser = await prisma.user.findUnique({
              where: { id: token.id as string },
              select: { password: true },
            });
            if (dbUser?.password) {
              token.needsPassword = undefined;
            }
          }

          return token;
        },
        session({ session, token }) {
          console.log("[session] called, token.id:", token.id);
          console.log("[session] token.role:", token.role);
          session.user.id = token.id as string;
          session.user.role = token.role as string;
          if (token.needsPassword === true) {
            session.user.needsPassword = true;
          }
          return session;
        },
      },
      debug: process.env.NODE_ENV === "development",
    });
  } catch (e) {
    console.error("[auth] NextAuth init failed:", e);
    throw e;
  }
}

export const { handlers, auth, signIn, signOut } = initNextAuth();
