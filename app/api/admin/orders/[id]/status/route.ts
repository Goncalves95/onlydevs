import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { OrderStatus } from "@/lib/generated/prisma/enums";

const VALID_STATUSES: OrderStatus[] = [
  "PENDING", "PAID", "FULFILLED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED",
];

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  // 404 for all non-admins — never reveal admin routes exist
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const { id: orderId } = await params;

  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const newStatus = body.status as OrderStatus;
  if (!VALID_STATUSES.includes(newStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const existing = await prisma.order.findUnique({
    where: { id: orderId },
    select: { id: true, status: true },
  });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: { status: newStatus },
  });

  // Audit log — no customer PII, no sensitive data
  console.log(
    JSON.stringify({
      event: "admin.order.status_changed",
      adminId: session?.user?.id ?? "unknown",
      orderId,
      oldStatus: existing.status,
      newStatus,
      ts: new Date().toISOString(),
    })
  );

  return NextResponse.json({ id: updated.id, status: updated.status });
}
