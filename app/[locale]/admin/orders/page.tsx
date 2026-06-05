import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/currency";
import { Link } from "@/lib/i18n/navigation";
import AdminOrdersFilter from "@/components/AdminOrdersFilter";
import AdminStatusSelect from "@/components/AdminStatusSelect";
import type { OrderStatus } from "@/lib/generated/prisma/enums";
import type { Locale } from "@/lib/i18n/routing";

const PAGE_SIZE = 20;

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

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
}

export const metadata = { title: "Admin — Orders" };

export default async function AdminOrdersPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page: pageStr, status: statusFilter, q } = await searchParams;

  const page = Math.max(1, parseInt(pageStr ?? "1") || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const validStatus = VALID_STATUSES.includes(statusFilter as OrderStatus)
    ? (statusFilter as OrderStatus)
    : undefined;
  const searchTerm = q?.trim() || undefined;

  const where = {
    ...(validStatus ? { status: validStatus } : {}),
    ...(searchTerm
      ? {
          OR: [
            { id: { contains: searchTerm } },
            { user: { email: { contains: searchTerm, mode: "insensitive" as const } } },
          ],
        }
      : {}),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      take: PAGE_SIZE,
      skip,
      where,
      include: {
        user: { select: { email: true } },
        items: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function pageHref(p: number) {
    const sp = new URLSearchParams();
    if (searchTerm) sp.set("q", searchTerm);
    if (validStatus) sp.set("status", validStatus);
    sp.set("page", String(p));
    return `/${locale}/admin/orders?${sp.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <span className="text-zinc-500 text-sm">{total.toLocaleString()} total</span>
      </div>

      <AdminOrdersFilter
        locale={locale}
        initialQ={q ?? ""}
        initialStatus={statusFilter ?? ""}
      />

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-medium">ID</th>
              <th className="text-left px-5 py-3 font-medium">Customer</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Items</th>
              <th className="text-left px-5 py-3 font-medium">Total</th>
              <th className="text-left px-5 py-3 font-medium">Currency</th>
              <th className="text-left px-5 py-3 font-medium">Status</th>
              <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Date</th>
              <th className="text-left px-5 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {orders.map((order) => (
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
                <td className="px-5 py-3.5 text-zinc-500 text-xs font-mono">
                  {order.currency}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${STATUS_STYLES[order.status]}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-zinc-500 text-xs hidden lg:table-cell">
                  {new Date(order.createdAt).toLocaleDateString("en-GB")}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2">
                    <AdminStatusSelect orderId={order.id} currentStatus={order.status} />
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="text-xs text-zinc-500 hover:text-purple-400 transition-colors whitespace-nowrap"
                    >
                      View →
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="text-center py-12 text-zinc-600 font-mono text-sm">
            // no orders found
          </p>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm">
          <p className="text-zinc-500">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            {page > 1 && (
              <a
                href={pageHref(page - 1)}
                className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-md text-zinc-300 hover:border-purple-500 transition-colors text-xs"
              >
                ← Prev
              </a>
            )}
            {page < totalPages && (
              <a
                href={pageHref(page + 1)}
                className="px-3 py-1.5 bg-zinc-900 border border-zinc-700 rounded-md text-zinc-300 hover:border-purple-500 transition-colors text-xs"
              >
                Next →
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
