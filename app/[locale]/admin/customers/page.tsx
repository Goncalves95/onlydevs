import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/currency";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/routing";
import AdminCustomersFilter from "@/components/AdminCustomersFilter";

const PAGE_SIZE = 20;

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ page?: string; q?: string }>;
}

export const metadata = { title: "Admin — Customers" };

export default async function AdminCustomersPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { page: pageStr, q } = await searchParams;

  const page = Math.max(1, parseInt(pageStr ?? "1") || 1);
  const skip = (page - 1) * PAGE_SIZE;
  const searchTerm = q?.trim() || undefined;

  const where = searchTerm
    ? { email: { contains: searchTerm, mode: "insensitive" as const } }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      take: PAGE_SIZE,
      skip,
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
        orders: {
          select: { totalAmount: true, currency: true },
          where: { status: { in: ["PAID", "FULFILLED", "SHIPPED", "DELIVERED"] } },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  function pageHref(p: number) {
    const sp = new URLSearchParams();
    if (searchTerm) sp.set("q", searchTerm);
    sp.set("page", String(p));
    return `/${locale}/admin/customers?${sp.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Customers</h1>
        <span className="text-zinc-500 text-sm">{total.toLocaleString()} total</span>
      </div>

      <AdminCustomersFilter locale={locale} initialQ={q ?? ""} />

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
              <th className="text-left px-5 py-3 font-medium">Customer</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Orders</th>
              <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Spent (CHF)</th>
              <th className="text-left px-5 py-3 font-medium hidden lg:table-cell">Spent (EUR)</th>
              <th className="text-left px-5 py-3 font-medium hidden md:table-cell">Joined</th>
              <th className="text-left px-5 py-3 font-medium">Role</th>
              <th className="text-left px-5 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {users.map((user) => {
              const chfSpent = user.orders
                .filter((o) => o.currency === "CHF")
                .reduce((s, o) => s + o.totalAmount, 0);
              const eurSpent = user.orders
                .filter((o) => o.currency === "EUR")
                .reduce((s, o) => s + o.totalAmount, 0);

              return (
                <tr key={user.id} className="hover:bg-zinc-800/40 transition-colors">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-zinc-200">{user.name ?? "—"}</p>
                    <p className="text-xs text-zinc-500 mt-0.5">{user.email}</p>
                  </td>
                  <td className="px-5 py-3.5 text-zinc-400 hidden md:table-cell">
                    {user._count.orders}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-zinc-300 hidden lg:table-cell">
                    {chfSpent > 0 ? formatPrice(chfSpent, "CHF") : "—"}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-xs text-zinc-300 hidden lg:table-cell">
                    {eurSpent > 0 ? formatPrice(eurSpent, "EUR") : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-zinc-500 text-xs hidden md:table-cell">
                    {new Date(user.createdAt).toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${
                        user.role === "ADMIN"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/30"
                          : "bg-zinc-800 text-zinc-500 border-zinc-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <Link
                      href={`/admin/customers/${user.id}`}
                      className="text-xs text-zinc-500 hover:text-purple-400 transition-colors whitespace-nowrap"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {users.length === 0 && (
          <p className="text-center py-12 text-zinc-600 font-mono text-sm">
            // no customers found
          </p>
        )}
      </div>

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
