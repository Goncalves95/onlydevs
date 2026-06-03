import { type NextRequest, NextResponse } from "next/server";
import NextAuth from "next-auth";
import createIntlMiddleware from "next-intl/middleware";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { authConfig } from "@/auth.config";
import { routing } from "@/lib/i18n/routing";

// Lightweight auth for Edge Runtime — no Prisma, no Node.js built-ins
const { auth } = NextAuth(authConfig);

const intlMiddleware = createIntlMiddleware(routing);

const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(20, "10 s"),
        analytics: false,
      })
    : null;

// Locale-prefixed protected paths (strip the /locale segment for matching)
const protectedPaths = ["/orders", "/profile", "/checkout"];
const adminPaths = ["/admin"];

function withoutLocale(pathname: string) {
  return pathname.replace(/^\/[a-z]{2}(\/|$)/, "/");
}

export default auth(async function middleware(req: NextRequest & { auth: unknown }) {
  const { pathname } = req.nextUrl;

  // ── 1. Rate-limit API routes ──────────────────────────────────────────────
  if (pathname.startsWith("/api/") && ratelimit) {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";
    const { success } = await ratelimit.limit(ip);
    if (!success) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }
    return NextResponse.next();
  }

  // ── 2. Skip static assets ─────────────────────────────────────────────────
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  // ── 3. Auth protection (session token is verified by NextAuth JWT) ────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).auth;
  const stripped = withoutLocale(pathname);
  const locale = pathname.split("/")[1] ?? routing.defaultLocale;

  if (adminPaths.some((p) => stripped.startsWith(p))) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session as any).user?.role !== "ADMIN") {
      return NextResponse.redirect(new URL(`/${locale}`, req.url));
    }
  }

  if (protectedPaths.some((p) => stripped.startsWith(p)) && !session) {
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── 4. i18n routing ───────────────────────────────────────────────────────
  return intlMiddleware(req) ?? NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
