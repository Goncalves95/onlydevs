import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { prisma } from "@/lib/prisma";

const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.fixedWindow(5, "1 h"),
        analytics: false,
      })
    : null;

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(pass: string) {
  return pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);
}

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
  try {
    const body = await req.json();
    email = (body.email ?? "").trim().toLowerCase();
    password = body.password ?? "";
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

  return NextResponse.json({ ok: true }, { status: 201 });
}
