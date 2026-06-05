import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, type Currency } from "@/lib/currency";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/routing";
import type { OrderStatus } from "@/lib/generated/prisma/enums";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account.orders" });
  return { title: t("title") };
}

// DD/MM/YYYY locales
const DMY_LOCALES: Locale[] = ["de", "fr", "it", "pt"];

function formatDate(date: Date, locale: Locale): string {
  if (DMY_LOCALES.includes(locale)) {
    return date.toLocaleDateString("en-GB"); // DD/MM/YYYY
  }
  return date.toLocaleDateString("en-US"); // MM/DD/YYYY
}

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING:   "bg-amber-500/10  text-amber-400  border-amber-500/30",
  PAID:      "bg-blue-500/10   text-blue-400   border-blue-500/30",
  FULFILLED: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  SHIPPED:   "bg-green-500/10  text-green-400  border-green-500/30",
  DELIVERED: "bg-teal-500/10   text-teal-400   border-teal-500/30",
  CANCELLED: "bg-red-500/10    text-red-400    border-red-500/30",
  REFUNDED:  "bg-zinc-500/10   text-zinc-400   border-zinc-500/30",
};

export default async function OrderHistoryPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();

  const [t, orders] = await Promise.all([
    getTranslations({ locale, namespace: "account" }),
    prisma.order.findMany({
      where: { userId: session.user.id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <section>
      <h1 className="text-2xl font-bold mb-8">{t("orders.title")}</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-zinc-900 border border-zinc-800 rounded-xl">
          <p className="font-mono text-zinc-500 text-sm mb-4">// {t("orders.empty")}</p>
          <Link
            href="/products"
            className="text-sm text-green-400 hover:text-green-300 underline underline-offset-4"
          >
            {t("orders.shopNow")}
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const itemCount = order.items.reduce((s, i) => s + i.quantity, 0);
            return (
              <div
                key={order.id}
                className="flex flex-col sm:flex-row sm:items-center gap-4 bg-zinc-900 border border-zinc-800 rounded-xl p-5 hover:border-zinc-700 transition-colors"
              >
                {/* Order ID + date */}
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm text-green-400 font-semibold">
                    #{order.id.slice(0, 8).toUpperCase()}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {formatDate(order.createdAt, locale)}
                    {" · "}
                    {t("orders.items", { count: itemCount })}
                  </p>
                </div>

                {/* Status badge */}
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border self-start sm:self-auto ${STATUS_STYLES[order.status]}`}
                >
                  {t(`status.${order.status}`)}
                </span>

                {/* Total */}
                <p className="font-mono font-semibold text-sm sm:text-base shrink-0">
                  {formatPrice(order.totalAmount, order.currency as Currency)}
                </p>

                {/* View details */}
                <Link
                  href={`/account/orders/${order.id}`}
                  className="text-xs text-zinc-400 hover:text-green-400 transition-colors shrink-0 underline underline-offset-4"
                >
                  {t("orders.viewDetails")}
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
