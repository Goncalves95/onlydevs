// Edge-compatible auth config — NO Prisma, NO Node.js built-ins.
// Used by middleware.ts (Edge Runtime).
// Full auth with PrismaAdapter lives in auth.ts (Node.js runtime only).
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Resend from "next-auth/providers/resend";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
    Resend({
      from: process.env.RESEND_FROM_EMAIL ?? "noreply@onlydevs.com",
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    // authorized() runs in Edge — do NOT query Prisma here.
    // Route-level auth protection is handled manually in middleware.ts.
    authorized() {
      return true;
    },
  },
};
