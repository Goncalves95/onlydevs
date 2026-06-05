import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, type Currency } from "@/lib/currency";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/routing";
import type { OrderStatus } from "@/lib/generated/prisma/enums";

interface Props {
  params: Promise<{ locale: Locale; id: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account.orderDetail" });
  return { title: t("title") };
}

interface ShippingAddress {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

const TIMELINE: OrderStatus[] = ["PENDING", "PAID", "FULFILLED", "SHIPPED", "DELIVERED"];

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING:   "bg-amber-500/10  text-amber-400  border-amber-500/30",
  PAID:      "bg-blue-500/10   text-blue-400   border-blue-500/30",
  FULFILLED: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  SHIPPED:   "bg-green-500/10  text-green-400  border-green-500/30",
  DELIVERED: "bg-teal-500/10   text-teal-400   border-teal-500/30",
  CANCELLED: "bg-red-500/10    text-red-400    border-red-500/30",
  REFUNDED:  "bg-zinc-500/10   text-zinc-400   border-zinc-500/30",
};

export default async function OrderDetailPage({ params }: Props) {
  const { locale, id } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const [t, order] = await Promise.all([
    getTranslations({ locale, namespace: "account" }),
    prisma.order.findFirst({
      where: { id, userId: session.user.id },
      include: { items: true },
    }),
  ]);

  if (!order) notFound();

  const currency = order.currency as Currency;
  const shipping = order.shippingAddress as ShippingAddress | null;
  const currentStep = TIMELINE.indexOf(order.status);
  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);

  return (
    <section className="space-y-8">
      {/* Back link + header */}
      <div>
        <Link
          href="/account/orders"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          ← {t("orderDetail.backToOrders")}
        </Link>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <h1 className="text-xl font-bold font-mono">
            #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[order.status]}`}
          >
            {t(`status.${order.status}`)}
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          {new Date(order.createdAt).toLocaleDateString(locale, {
            year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>

      {/* Timeline — only for non-cancelled orders */}
      {order.status !== "CANCELLED" && order.status !== "REFUNDED" && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-5">
            {t("orderDetail.progress")}
          </h2>
          <div className="flex items-center gap-0">
            {TIMELINE.map((step, i) => {
              const done = i <= currentStep;
              const isLast = i === TIMELINE.length - 1;
              return (
                <div key={step} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center gap-1.5 shrink-0">
                    <div
                      className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-colors ${
                        done
                          ? "border-green-500 bg-green-500/20"
                          : "border-zinc-700 bg-zinc-900"
                      }`}
                    >
                      {done && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="text-green-400">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-xs text-center leading-tight ${done ? "text-green-400" : "text-zinc-600"}`}>
                      {t(`status.${step}`)}
                    </span>
                  </div>
                  {!isLast && (
                    <div className={`flex-1 h-0.5 mx-1 mb-5 ${i < currentStep ? "bg-green-500" : "bg-zinc-700"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Line items */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4">
          <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            {t("orderDetail.lineItems")}
          </h2>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between gap-4 text-sm">
              <div className="min-w-0">
                <p className="font-medium truncate">{item.productName}</p>
                {item.variantName && (
                  <p className="text-xs text-zinc-500 mt-0.5">{item.variantName}</p>
                )}
                <p className="text-xs text-zinc-500 mt-0.5">× {item.quantity}</p>
              </div>
              <p className="font-mono text-green-400 shrink-0">
                {formatPrice(item.price * item.quantity, currency)}
              </p>
            </div>
          ))}
        </div>

        {/* Right column: totals + shipping + tracking */}
        <div className="space-y-4">
          {/* Totals */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-3 text-sm">
            <div className="flex justify-between text-zinc-400">
              <span>{t("orderDetail.subtotal")}</span>
              <span className="font-mono">{formatPrice(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between text-zinc-400">
              <span>{t("orderDetail.shippingCost")}</span>
              <span className="text-zinc-500 text-xs">—</span>
            </div>
            <p className="text-xs text-zinc-600">{t("orderDetail.vatIncl")}</p>
            <div className="border-t border-zinc-800 pt-3 flex justify-between font-semibold">
              <span>{t("orderDetail.total")}</span>
              <span className="font-mono text-green-400">{formatPrice(order.totalAmount, currency)}</span>
            </div>
          </div>

          {/* Shipping address */}
          {shipping && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-sm space-y-1">
              <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
                {t("orderDetail.shippingAddress")}
              </h2>
              {shipping.name && <p className="font-medium">{shipping.name}</p>}
              {shipping.line1 && <p className="text-zinc-400">{shipping.line1}</p>}
              {shipping.line2 && <p className="text-zinc-400">{shipping.line2}</p>}
              <p className="text-zinc-400">
                {[shipping.postalCode, shipping.city].filter(Boolean).join(" ")}
              </p>
              {shipping.country && <p className="text-zinc-400">{shipping.country}</p>}
            </div>
          )}

          {/* Tracking */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-sm">
            <h2 className="text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-3">
              {t("orderDetail.tracking")}
            </h2>
            {order.trackingNumber ? (
              <div className="space-y-1">
                <p className="font-mono text-xs text-zinc-300">{order.trackingNumber}</p>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-green-400 hover:text-green-300 underline underline-offset-4"
                  >
                    Track shipment →
                  </a>
                )}
              </div>
            ) : (
              <p className="text-xs text-zinc-500 font-mono">// {t("orderDetail.noTracking")}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
