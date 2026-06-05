import { notFound, redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { formatPrice, type Currency } from "@/lib/currency";
import { Link } from "@/lib/i18n/navigation";
import ClearCartOnMount from "@/components/ClearCartOnMount";
import type { Locale } from "@/lib/i18n/routing";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ session_id?: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "checkout" });
  return { title: t("success.title") };
}

export default async function OrderSuccessPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { session_id } = await searchParams;
  const t = await getTranslations({ locale, namespace: "checkout" });

  if (!session_id) redirect(`/${locale}/products`);

  // ── Auth check ───────────────────────────────────────────────────────────────
  const authSession = await auth();
  if (!authSession?.user?.id) {
    redirect(`/${locale}/login`);
  }
  const userId = authSession.user.id;

  // ── Verify Stripe session ─────────────────────────────────────────────────────
  // Retrieve from Stripe to confirm payment status — never trust query params alone.
  let stripeSession;
  try {
    stripeSession = await getStripe().checkout.sessions.retrieve(session_id, {
      expand: ["line_items"],
    });
  } catch {
    notFound();
  }

  if (stripeSession.payment_status !== "paid") {
    redirect(`/${locale}/cart`);
  }

  const orderId = stripeSession.metadata?.orderId;
  if (!orderId) notFound();

  // ── Load order from DB — always scoped to authenticated userId ────────────────
  const order = await prisma.order.findFirst({
    where: { id: orderId, userId },
    include: { items: true },
  });

  if (!order) notFound();

  const currency = order.currency as Currency;

  return (
    <main className="max-w-xl mx-auto px-6 py-24 text-center">
      {/* Clear the cookie cart client-side */}
      <ClearCartOnMount />

      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/10 border border-green-500 mb-8">
        <svg
          className="w-8 h-8 text-green-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold mb-3">{t("success.title")}</h1>
      <p className="text-zinc-400 mb-10">{t("success.subtitle")}</p>

      {/* Order summary — only internal data, no Stripe raw fields */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-left space-y-4 mb-8">
        <p className="text-xs font-mono text-zinc-500">
          {t("success.orderNumber", { id: order.id.slice(0, 8).toUpperCase() })}
        </p>

        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-zinc-500 text-xs">{item.variantName} × {item.quantity}</p>
              </div>
              <p className="font-mono text-green-400">
                {formatPrice(item.price * item.quantity, currency)}
              </p>
            </div>
          ))}
        </div>

        <div className="border-t border-zinc-800 pt-4 flex justify-between font-semibold">
          <span>Total</span>
          <span className="font-mono text-green-400">
            {formatPrice(order.totalAmount, currency)}
          </span>
        </div>

        <p className="text-xs text-zinc-500">{t("success.estimatedDelivery")}</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/products"
          className="border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-semibold px-6 py-2.5 rounded-md text-sm transition-colors"
        >
          {t("success.continueShopping")}
        </Link>
        <Link
          href="/account/orders"
          className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-2.5 rounded-md text-sm transition-colors"
        >
          {t("success.viewOrders")}
        </Link>
      </div>
    </main>
  );
}
