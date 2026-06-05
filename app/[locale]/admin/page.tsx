import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/currency";
import { Link } from "@/lib/i18n/navigation";
import type { OrderStatus } from "@/lib/generated/prisma/enums";
import type { Locale } from "@/lib/i18n/routing";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export const metadata = { title: "Admin — Overview" };

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING:   "bg-amber-500/10  text-amber-400  border-amber-500/30",
  PAID:      "bg-blue-500/10   text-blue-400   border-blue-500/30",
  FULFILLED: "bg-purple-500/10 text-purple-400 border-purple-500/30",
  SHIPPED:   "bg-green-500/10  text-green-400  border-green-500/30",
  DELIVERED: "bg-teal-500/10   text-teal-400   border-teal-500/30",
  CANCELLED: "bg-red-500/10    text-red-400    border-red-500/30",
  REFUNDED:  "bg-zinc-500/10   text-zinc-400   border-zinc-500/30",
};

const ALL_STATUSES: OrderStatus[] = [
  "PENDING", "PAID", "FULFILLED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED",
];

const REVENUE_STATUSES: OrderStatus[] = ["PAID", "FULFILLED", "SHIPPED", "DELIVERED"];

export default async function AdminOverviewPage({ params }: Props) {
  await params;

  const todayStart = new Date();
  todayStart.setUTCHours(0, 0, 0, 0);

  const [revenueByCurrency, ordersByStatus, customerCount, newOrdersToday, recentOrders] =
    await Promise.all([
      prisma.order.groupBy({
        by: ["currency"],
        where: { status: { in: REVENUE_STATUSES } },
        _sum: { totalAmount: true },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { id: true },
      }),
      prisma.user.count(),
      prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.order.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { email: true } },
          items: true,
        },
      }),
    ]);

  const chfRevenue = revenueByCurrency.find((r) => r.currency === "CHF")?._sum.totalAmount ?? 0;
  const eurRevenue = revenueByCurrency.find((r) => r.currency === "EUR")?._sum.totalAmount ?? 0;

  const statusCounts = Object.fromEntries(
    ordersByStatus.map((s) => [s.status, s._count.id])
  ) as Partial<Record<OrderStatus, number>>;

  const totalOrders = ordersByStatus.reduce((sum, s) => sum + s._count.id, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Overview</h1>

      {/* Revenue + key stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Revenue (CHF)" value={formatPrice(chfRevenue, "CHF")} glow />
        <StatCard label="Revenue (EUR)" value={formatPrice(eurRevenue, "EUR")} glow />
        <StatCard label="Total customers" value={customerCount.toLocaleString()} />
        <StatCard label="New orders today" value={newOrdersToday.toLocaleString()} />
      </div>

      {/* Orders by status */}
      <div>
        <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">
          Orders by status
          <span className="ml-2 text-zinc-700 normal-case font-normal">({totalOrders} total)</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {ALL_STATUSES.map((status) => (
            <div key={status} className="bg-zinc-900 border border-zinc-800 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold font-mono mb-1">{statusCounts[status] ?? 0}</p>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[status]}`}>
                {status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
            Recent orders
          </h2>
          <Link
            href="/admin/orders"
            className="text-xs text-purple-400 hover:text-purple-300 transition-colors"
          >
            View all →
          </Link>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                <th className="text-left px-5 py-3 font-medium">ID</th>
                <th className="text-left px-5 py-3 font-medium">Customer</th>
                <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Items</th>
                <th className="text-left px-5 py-3 font-medium">Total</th>
                <th className="text-left px-5 py-3 font-medium">Status</th>
                <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-mono text-xs text-purple-400 hover:text-purple-300 transition-colors"
                    >
                      #{order.id.slice(0, 8).toUpperCase()}
                    </Link>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-300 text-xs max-w-[180px] truncate">
                    {order.user.email}
                  </td>
                  <td className="px-5 py-3.5 text-zinc-500 text-xs hidden md:table-cell">
                    {order.items.reduce((s, i) => s + i.quantity, 0)}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-sm font-semibold">
                    {formatPrice(order.totalAmount, order.currency as "CHF" | "EUR")}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-500 text-xs hidden lg:table-cell">
                    {new Date(order.createdAt).toLocaleDateString("en-GB")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentOrders.length === 0 && (
            <p className="text-center py-12 text-zinc-600 font-mono text-sm">
              // no orders yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, glow }: { label: string; value: string; glow?: boolean }) {
  return (
    <div
      className={`bg-zinc-900 rounded-xl p-5 border ${
        glow
          ? "border-purple-500/20 shadow-lg shadow-purple-500/5"
          : "border-zinc-800"
      }`}
    >
      <p className="text-xs text-zinc-500 uppercase tracking-wider mb-2">{label}</p>
      <p className="text-2xl font-bold font-mono">{value}</p>
    </div>
  );
}
