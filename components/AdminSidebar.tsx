"use client";

import { usePathname } from "@/lib/i18n/navigation";
import { Link } from "@/lib/i18n/navigation";

const NAV = [
  { label: "Overview",  href: "/admin" },
  { label: "Orders",    href: "/admin/orders" },
  { label: "Products",  href: "/admin/products" },
  { label: "Customers", href: "/admin/customers" },
  { label: "Settings",  href: "/admin/settings" },
] as const;

export default function AdminSidebar() {
  const pathname = usePathname(); // locale-stripped

  function isActive(href: string) {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  }

  return (
    <aside className="w-56 shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col min-h-screen sticky top-0 h-screen overflow-y-auto">
      <div className="h-14 flex items-center px-5 border-b border-zinc-800 shrink-0">
        <span className="font-mono font-bold text-purple-500 text-sm tracking-tight">
          // admin
        </span>
      </div>
      <nav className="flex-1 p-3 space-y-0.5">
        {NAV.map(({ label, href }) => (
          <Link
            key={href}
            href={href}
            className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive(href)
                ? "bg-purple-500/10 text-purple-400 border border-purple-500/20"
                : "text-zinc-400 hover:text-white hover:bg-zinc-900 border border-transparent"
            }`}
          >
            {label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-zinc-800 shrink-0 space-y-3">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-zinc-500 hover:text-green-400 hover:bg-zinc-900 border border-transparent transition-colors w-full"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Back to store
        </Link>
        <p className="text-xs text-zinc-700 font-mono px-3">onlydevs admin</p>
      </div>
    </aside>
  );
}
