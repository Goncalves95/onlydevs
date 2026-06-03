"use client";

import { signOut } from "next-auth/react";
import { usePathname } from "@/lib/i18n/navigation";
import { Link } from "@/lib/i18n/navigation";
import { cn } from "@/lib/utils";

interface NavLabels {
  orders: string;
  profile: string;
  addresses: string;
  signOut: string;
}

interface Props {
  locale: string;
  labels: NavLabels;
}

function IconPackage() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="16.5 9.4 7.55 4.24" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function IconUser() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function IconMapPin() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconLogout() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

export default function AccountNav({ locale, labels }: Props) {
  const pathname = usePathname();

  const navItems = [
    { href: "/orders" as const, label: labels.orders, icon: <IconPackage /> },
    { href: "/profile" as const, label: labels.profile, icon: <IconUser /> },
    { href: "/addresses" as const, label: labels.addresses, icon: <IconMapPin /> },
  ];

  const linkClass = (href: string) =>
    cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
      pathname === href
        ? "bg-green-500/10 text-green-400 border border-green-500/30"
        : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent"
    );

  return (
    <>
      {/* Desktop sidebar */}
      <nav className="hidden md:flex flex-col gap-1 w-52 shrink-0" aria-label="Account navigation">
        {navItems.map(({ href, label, icon }) => (
          <Link key={href} href={href} className={linkClass(href)}>
            {icon}
            {label}
          </Link>
        ))}

        <div className="mt-4 pt-4 border-t border-zinc-800">
          <button
            onClick={() => signOut({ callbackUrl: `/${locale}` })}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-zinc-500 hover:text-red-400 hover:bg-zinc-800 border border-transparent transition-colors w-full text-left"
          >
            <IconLogout />
            {labels.signOut}
          </button>
        </div>
      </nav>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-zinc-950 border-t border-zinc-800 flex" aria-label="Account navigation">
        {navItems.map(({ href, label, icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs transition-colors",
              pathname === href ? "text-green-400" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {icon}
            <span>{label}</span>
          </Link>
        ))}
        <button
          onClick={() => signOut({ callbackUrl: `/${locale}` })}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 text-xs text-zinc-500 hover:text-red-400 transition-colors"
        >
          <IconLogout />
          <span>{labels.signOut}</span>
        </button>
      </nav>
    </>
  );
}
