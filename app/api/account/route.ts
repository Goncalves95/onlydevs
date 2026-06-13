import { NextResponse } from "next/server";
import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { sendAccountDeletedEmail } from "@/lib/email";

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const userId = session.user.id;

  console.log(`[gdpr] account deletion requested for user [redacted]`);

  // Capture email BEFORE anonymising — we need it to send the confirmation
  const userRecord = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });
  const emailToNotify = userRecord?.email ?? null;

  // Run all anonymisation in a single transaction
  await prisma.$transaction([
    // 1. Revoke all OAuth connections
    prisma.account.deleteMany({ where: { userId } }),

    // 2. Revoke all active sessions — user is immediately signed out
    prisma.session.deleteMany({ where: { userId } }),

    // 3. Remove saved addresses
    prisma.address.deleteMany({ where: { userId } }),

    // 4. Anonymise the user record — replace PII with placeholder values.
    //    We keep the row so that Order.userId foreign key stays intact
    //    (orders are retained for financial record-keeping).
    prisma.user.update({
      where: { id: userId },
      data: {
        name: null,
        image: null,
        email: `deleted-${userId}@deleted.invalid`,
        stripeId: null,
        password: null,
      },
    }),
  ]);

  // Sign out — session no longer exists in DB so the cookie becomes invalid.
  // We do this server-side so the response clears the auth cookie.
  try {
    await signOut({ redirect: false });
  } catch {
    // signOut may throw if session is already gone — that's fine
  }

  // Send confirmation email — don't block deletion if this fails
  if (emailToNotify) {
    try {
      await sendAccountDeletedEmail({ to: emailToNotify });
    } catch (err) {
      console.error("[gdpr] account-deleted email failed:", err);
    }
  }

  return NextResponse.json({ ok: true });
}
