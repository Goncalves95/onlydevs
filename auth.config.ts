// Edge-compatible auth config — NO Prisma, NO Node.js built-ins.
// Used by middleware.ts (Edge Runtime).
// Full auth with PrismaAdapter lives in auth.ts (Node.js runtime only).
// IMPORTANT: Only include OAuth providers here. Email/magic-link providers
// (Resend, Nodemailer, etc.) require a database adapter and must stay in
// auth.ts — adding them here will crash the Edge runtime with MissingAdapter.
import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";

export const authConfig: NextAuthConfig = {
  trustHost: true,
  basePath: "/api/auth",
  session: { strategy: "jwt" },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
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
    // Expose JWT claims to the session so middleware can read them in Edge runtime.
    // Edge-safe — reads from token only, no Prisma.
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as string;
      if (token.needsPassword === true) {
        session.user.needsPassword = true;
      }
      return session;
    },
  },
};
