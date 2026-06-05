import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/currency";
import { Link } from "@/lib/i18n/navigation";
import type { OrderStatus } from "@/lib/generated/prisma/enums";
import type { Locale } from "@/lib/i18n/routing";

interface Props {
  params: Promise<{ locale: Locale; id: string }>;
}

export const metadata = { title: "Admin — Order Detail" };

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING:   "bg-amber-500/10  text-amber-400  border-amber-500/30",
  PAID:      "bg-blue-500/10   text-blue-400   border-blue-500/30",
  FULFILLED: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  SHIPPED:   "bg-green-500/10  text-green-400  border-green-500/30",
  DELIVERED: "bg-teal-500/10   text-teal-400   border-teal-500/30",
  CANCELLED: "bg-red-500/10    text-red-400    border-red-500/30",
  REFUNDED:  "bg-zinc-500/10   text-zinc-400   border-zinc-500/30",
};

const VALID_STATUSES: OrderStatus[] = [
  "PENDING", "PAID", "FULFILLED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED",
];

interface ShippingAddress {
  name?: string;
  line1?: string;
  line2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { locale, id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      user: { select: { id: true, name: true, email: true } },
      items: true,
    },
  });

  if (!order) notFound();

  const shipping = order.shippingAddress as ShippingAddress | null;
  const currency = order.currency as "CHF" | "EUR";
  const subtotal = order.items.reduce((s, i) => s + i.price * i.quantity, 0);

  async function overrideStatus(formData: FormData) {
    "use server";
    const session = await auth();
    if (session?.user?.role !== "ADMIN") return;

    const newStatus = formData.get("status") as string;
    if (!VALID_STATUSES.includes(newStatus as OrderStatus)) return;

    const prev = await prisma.order.findUnique({
      where: { id },
      select: { status: true },
    });

    await prisma.order.update({
      where: { id },
      data: { status: newStatus as OrderStatus },
    });

    console.log(
      JSON.stringify({
        event: "admin.order.status_changed",
        adminId: session?.user?.id ?? "unknown",
        orderId: id,
        oldStatus: prev?.status,
        newStatus,
        ts: new Date().toISOString(),
      })
    );

    revalidatePath(`/${locale}/admin/orders/${id}`);
    revalidatePath(`/${locale}/admin/orders`);
    revalidatePath(`/${locale}/admin`);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Link
          href="/admin/orders"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          ← Back to orders
        </Link>
        <div className="flex flex-wrap items-center gap-3 mt-3">
          <h1 className="text-xl font-bold font-mono">
            #{order.id.slice(0, 8).toUpperCase()}
          </h1>
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[order.status]}`}
          >
            {order.status}
          </span>
        </div>
        <p className="text-xs text-zinc-500 mt-1">
          {new Date(order.createdAt).toLocaleString("en-GB", {
            year: "numeric", month: "long", day: "numeric",
            hour: "2-digit", minute: "2-digit",
          })}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: line items */}
        <div className="lg:col-span-2 space-y-6">
          {/* Customer */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              Customer
            </h2>
            <div className="space-y-1 text-sm">
              {order.user.name && (
                <p className="font-medium">{order.user.name}</p>
              )}
              <p className="text-zinc-400">{order.user.email}</p>
              <Link
                href={`/admin/customers/${order.user.id}`}
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                View customer →
              </Link>
            </div>
          </div>

          {/* Line items */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              Items ordered
            </h2>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.id} className="flex justify-between gap-4 text-sm">
                  <div className="min-w-0">
                    <p className="font-medium">{item.productName}</p>
                    {item.variantName && (
                      <p className="text-xs text-zinc-500 mt-0.5">{item.variantName}</p>
                    )}
                    <p className="text-xs text-zinc-600 mt-0.5">× {item.quantity}</p>
                  </div>
                  <p className="font-mono text-sm font-semibold shrink-0">
                    {formatPrice(item.price * item.quantity, currency)}
                  </p>
                </div>
              ))}
              <div className="border-t border-zinc-800 pt-4 space-y-2 text-sm">
                <div className="flex justify-between text-zinc-400">
                  <span>Subtotal</span>
                  <span className="font-mono">{formatPrice(subtotal, currency)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="font-mono text-purple-400">
                    {formatPrice(order.totalAmount, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Status override */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">
              Override status
            </h2>
            <form action={overrideStatus} className="flex items-center gap-3">
              <select
                name="status"
                defaultValue={order.status}
                className="bg-zinc-950 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors"
              >
                {VALID_STATUSES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-md text-sm transition-colors"
              >
                Update
              </button>
            </form>
          </div>
        </div>

        {/* Right: metadata */}
        <div className="space-y-4">
          {/* Shipping address */}
          {shipping && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-sm">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Shipping address
              </h2>
              <div className="space-y-0.5 text-zinc-400">
                {shipping.name && <p className="font-medium text-white">{shipping.name}</p>}
                {shipping.line1 && <p>{shipping.line1}</p>}
                {shipping.line2 && <p>{shipping.line2}</p>}
                <p>{[shipping.postalCode, shipping.city].filter(Boolean).join(" ")}</p>
                {shipping.country && <p>{shipping.country}</p>}
              </div>
            </div>
          )}

          {/* Stripe */}
          {order.stripePaymentId && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-sm">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Stripe payment
              </h2>
              <p className="font-mono text-xs text-zinc-400 break-all mb-2">
                {order.stripePaymentId}
              </p>
              <a
                href={`https://dashboard.stripe.com/payments/${order.stripePaymentId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
              >
                View in Stripe →
              </a>
            </div>
          )}

          {/* Printful */}
          {order.printfulOrderId && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-sm">
              <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
                Printful order
              </h2>
              <p className="font-mono text-xs text-zinc-400 mb-2">{order.printfulOrderId}</p>
              {order.trackingNumber && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-zinc-500 uppercase tracking-wider">Tracking</p>
                  <p className="font-mono text-xs text-zinc-300">{order.trackingNumber}</p>
                  {order.trackingUrl && (
                    <a
                      href={order.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      Track shipment →
                    </a>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Internal IDs */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 text-sm">
            <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
              Internal
            </h2>
            <div className="space-y-1.5">
              <div>
                <p className="text-xs text-zinc-600">Order ID</p>
                <p className="font-mono text-xs text-zinc-400 break-all">{order.id}</p>
              </div>
              <div>
                <p className="text-xs text-zinc-600">Currency</p>
                <p className="font-mono text-xs text-zinc-400">{order.currency}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
