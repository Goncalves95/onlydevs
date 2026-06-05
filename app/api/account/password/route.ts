import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

function isStrongPassword(pass: string) {
  return pass.length >= 8 && /[A-Z]/.test(pass) && /[0-9]/.test(pass);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "UNAUTHORIZED" }, { status: 401 });
  }
  const userId = session.user.id;

  let body: {
    type: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "INVALID_REQUEST" }, { status: 400 });
  }

  const { type, currentPassword, newPassword = "", confirmPassword = "" } = body;

  if (!newPassword || !confirmPassword) {
    return NextResponse.json({ error: "MISSING_FIELDS" }, { status: 400 });
  }
  if (newPassword !== confirmPassword) {
    return NextResponse.json({ error: "PASSWORD_MISMATCH" }, { status: 400 });
  }
  if (!isStrongPassword(newPassword)) {
    return NextResponse.json({ error: "WEAK_PASSWORD" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { password: true },
  });
  if (!user) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  if (type === "set") {
    if (user.password) {
      return NextResponse.json({ error: "PASSWORD_EXISTS" }, { status: 400 });
    }
  } else if (type === "change") {
    if (!user.password) {
      return NextResponse.json({ error: "NO_PASSWORD_SET" }, { status: 400 });
    }
    if (!currentPassword) {
      return NextResponse.json({ error: "MISSING_CURRENT_PASSWORD" }, { status: 400 });
    }
    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return NextResponse.json({ error: "WRONG_PASSWORD" }, { status: 400 });
    }
  } else {
    return NextResponse.json({ error: "INVALID_TYPE" }, { status: 400 });
  }

  const hash = await bcrypt.hash(newPassword, 12);
  await prisma.user.update({
    where: { id: userId },
    data: { password: hash },
  });

  return NextResponse.json({ ok: true });
}
