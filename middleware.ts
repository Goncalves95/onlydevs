import { type NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { auth } from "@/auth";
import { routing } from "@/lib/i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.slidingWindow(20, "10 s"),
        analytics: false,
      })
    : null;

// Locale-prefixed protected paths (strip the locale segment for matching)
const protectedPaths = ["/orders", "/profile", "/checkout"];
const adminPaths = ["/admin"];

function isProtected(pathname: string) {
  // pathname looks like /en/orders — strip the leading /locale segment
  const withoutLocale = pathname.replace(/^\/[a-z]{2}/, "");
  return protectedPaths.some((p) => withoutLocale.startsWith(p));
}

function isAdmin(pathname: string) {
  const withoutLocale = pathname.replace(/^\/[a-z]{2}/, "");
  return adminPaths.some((p) => withoutLocale.startsWith(p));
}

export default auth(async function middleware(req: NextRequest & { auth: unknown }) {
  const { pathname } = req.nextUrl;

  // ── 1. Rate limit API routes ──────────────────────────────────────────────
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

  // ── 3. i18n routing ───────────────────────────────────────────────────────
  const intlResponse = intlMiddleware(req);

  // ── 4. Auth protection ────────────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const session = (req as any).auth;

  if (isAdmin(pathname)) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!session || (session as any).user?.role !== "ADMIN") {
      return NextResponse.redirect(
        new URL(`/${pathname.split("/")[1]}`, req.url)
      );
    }
  }

  if (isProtected(pathname) && !session) {
    const locale = pathname.split("/")[1] ?? "en";
    const loginUrl = new URL(`/${locale}/login`, req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return intlResponse ?? NextResponse.next();
});

export const config = {
  matcher: [
    // Match everything except Next internals and static files
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
