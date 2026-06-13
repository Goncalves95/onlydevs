import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { prisma } from "@/lib/prisma";
import { sendWelcomeEmail } from "@/lib/email";
import { isValidEmail, isStrongPassword } from "@/lib/validation";

const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.fixedWindow(5, "1 h"),
        analytics: false,
      })
    : null;


export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "127.0.0.1";

  if (ratelimit) {
    const { success } = await ratelimit.limit(`register:${ip}`);
    if (!success) {
      return NextResponse.json({ error: "RATE_LIMIT" }, { status: 429 });
    }
  }

  let email: string;
  let password: string;
  let locale: string;
  try {
    const body = await req.json();
    email = (body.email ?? "").trim().toLowerCase();
    password = body.password ?? "";
    locale = typeof body.locale === "string" && body.locale ? body.locale : "en";
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
  }
  if (!isStrongPassword(password)) {
    return NextResponse.json({ error: "WEAK_PASSWORD" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });
  if (existing) {
    return NextResponse.json({ error: "EMAIL_TAKEN" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { email, password: hash },
    select: { id: true },
  });

  console.log("[register] user created:", email);
  // events.createUser does not fire for direct prisma creates — send welcome here
  try {
    await sendWelcomeEmail({ to: email, name: email });
    console.log("[register] welcome email sent to:", email);
  } catch (e) {
    console.error("[register] welcome email failed:", e);
  }

  return NextResponse.json({ ok: true, redirectTo: `/${locale}` }, { status: 201 });
}
