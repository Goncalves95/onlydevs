import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/currency";
import { Link } from "@/lib/i18n/navigation";
import type { OrderStatus } from "@/lib/generated/prisma/enums";
import type { Locale } from "@/lib/i18n/routing";

interface Props {
  params: Promise<{ locale: Locale; id: string }>;
}

export const metadata = { title: "Admin — Customer Detail" };

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING:   "bg-amber-500/10  text-amber-400  border-amber-500/30",
  PAID:      "bg-blue-500/10   text-blue-400   border-blue-500/30",
  FULFILLED: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  SHIPPED:   "bg-green-500/10  text-green-400  border-green-500/30",
  DELIVERED: "bg-teal-500/10   text-teal-400   border-teal-500/30",
  CANCELLED: "bg-red-500/10    text-red-400    border-red-500/30",
  REFUNDED:  "bg-zinc-500/10   text-zinc-400   border-zinc-500/30",
};

export default async function AdminCustomerDetailPage({ params }: Props) {
  const { id } = await params;

  const [customer, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        // password intentionally omitted
      },
    }),
    prisma.order.findMany({
      where: { userId: id },
      include: { items: true },
      orderBy: { createdAt: "desc" },
    }),
  ]);

  if (!customer) notFound();

  const paidOrders = orders.filter((o) =>
    ["PAID", "FULFILLED", "SHIPPED", "DELIVERED"].includes(o.status)
  );
  const chfSpent = paidOrders
    .filter((o) => o.currency === "CHF")
    .reduce((s, o) => s + o.totalAmount, 0);
  const eurSpent = paidOrders
    .filter((o) => o.currency === "EUR")
    .reduce((s, o) => s + o.totalAmount, 0);

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/customers"
          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          ← Back to customers
        </Link>
        <div className="flex items-center gap-3 mt-3">
          <h1 className="text-xl font-bold">{customer.name ?? customer.email}</h1>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
              customer.role === "ADMIN"
                ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                : "bg-zinc-800 text-zinc-500 border-zinc-700"
            }`}
          >
            {customer.role}
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Email</p>
          <p className="text-sm font-medium truncate">{customer.email}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Total orders</p>
          <p className="text-2xl font-bold font-mono">{orders.length}</p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Spent (CHF)</p>
          <p className="text-lg font-bold font-mono">
            {chfSpent > 0 ? formatPrice(chfSpent, "CHF") : "—"}
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
          <p className="text-xs text-zinc-500 mb-1">Spent (EUR)</p>
          <p className="text-lg font-bold font-mono">
            {eurSpent > 0 ? formatPrice(eurSpent, "EUR") : "—"}
          </p>
        </div>
      </div>

      {/* Order history */}
      <div>
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Order history
        </h2>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">ID</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Items</th>
                <th className="text-left px-5 py-3 font-medium">Total</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Date</th>
                <th className="text-left px-5 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {orders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs text-zinc-400">
                      #{order.id.slice(0, 8).toUpperCase()}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-500 text-xs hidden md:table-cell">
                    {order.items.reduce((s, i) => s + i.quantity, 0)}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-sm font-semibold">
                    {formatPrice(order.totalAmount, order.currency as "CHF" | "EUR")}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-500 text-xs hidden md:table-cell">
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-zinc-500 hover:text-purple-400 transition-colors"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="text-center py-10 text-zinc-600 font-mono text-sm">
              // no orders yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
