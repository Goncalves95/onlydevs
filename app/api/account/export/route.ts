import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.fixedWindow(1, "1 h"),
        analytics: false,
      })
    : null;

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  // Rate limit: 1 export per hour per user (skipped if Redis not configured)
  if (ratelimit) {
    const { success } = await ratelimit.limit(`export:${userId}`);
    if (!success) {
      return NextResponse.json(
        { error: "You can only request an export once per hour." },
        { status: 429 }
      );
    }
  }

  console.log(`[gdpr] data export requested for user [redacted]`);

  const [user, orders, addresses] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, createdAt: true },
    }),
    prisma.order.findMany({
      where: { userId },
      select: {
        id: true,
        status: true,
        currency: true,
        totalAmount: true,
        createdAt: true,
        shippingAddress: true,
        items: {
          select: {
            productName: true,
            variantName: true,
            quantity: true,
            price: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.address.findMany({
      where: { userId },
      select: {
        line1: true,
        line2: true,
        city: true,
        state: true,
        postalCode: true,
        country: true,
        isDefault: true,
      },
    }),
  ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    profile: user,
    orders,
    addresses,
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": 'attachment; filename="onlydevs-data.json"',
    },
  });
}
