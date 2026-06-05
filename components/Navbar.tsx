"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { signOut } from "next-auth/react";
import { Link, usePathname } from "@/lib/i18n/navigation";
import { useCartStore } from "@/lib/store/cart";
import CurrencyToggle from "@/components/CurrencyToggle";
import type { Currency } from "@/lib/currency";

interface Props {
  currency: Currency;
  isAuthenticated: boolean;
  isAdmin: boolean;
  locale: string;
}

export default function Navbar({ currency, isAuthenticated, isAdmin, locale }: Props) {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const itemCount = useCartStore((s) => s.itemCount());

  useEffect(() => setMounted(true), []);
  useEffect(() => setMenuOpen(false), [pathname]);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  const navLinks = [{ href: "/products", label: t("shop") }] as const;
  const comingSoonLinks = [t("drops"), t("about")] as const;

  return (
    <>
      <header className="sticky top-0 z-50 h-14 md:h-[60px] bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 h-full flex items-center justify-between gap-4">

          {/* Left — logo */}
          <Link
            href="/"
            className="font-mono font-bold text-green-400 hover:text-green-300 transition-colors shrink-0"
          >
            OnlyDevs
          </Link>

          {/* Center — desktop links */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main navigation">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm font-medium transition-colors ${
                  isActive(href)
                    ? "text-green-400"
                    : "text-zinc-300 hover:text-white"
                }`}
              >
                {label}
              </Link>
            ))}
            {comingSoonLinks.map((label) => (
              <span
                key={label}
                className="text-sm font-medium text-zinc-600 cursor-not-allowed select-none"
                title="Coming soon"
              >
                {label}
              </span>
            ))}
          </nav>

          {/* Right */}
          <div className="flex items-center gap-1 md:gap-2">
            <div className="hidden md:block mr-1">
              <CurrencyToggle current={currency} />
            </div>

            {/* Cart */}
            <Link
              href="/cart"
              className="relative p-2 text-zinc-400 hover:text-white transition-colors"
              aria-label={t("cart")}
            >
              <CartIcon />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-green-500 text-black text-[10px] font-bold leading-none px-1">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>

            {/* Auth — desktop */}
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="hidden md:inline-flex items-center gap-1 text-xs font-medium text-purple-400 hover:text-purple-300 border border-purple-800 hover:border-purple-600 px-2.5 py-1 rounded-md transition-colors"
                    title="Admin Dashboard"
                  >
                    <ShieldIcon />
                    Admin
                  </Link>
                )}
                <Link
                  href="/account/orders"
                  className="hidden md:block p-2 text-zinc-400 hover:text-white transition-colors"
                  aria-label={t("account")}
                  title={t("account")}
                >
                  <AccountIcon />
                </Link>
                <button
                  onClick={() => signOut({ callbackUrl: `/${locale}` })}
                  className="hidden md:block p-2 text-zinc-500 hover:text-red-400 transition-colors"
                  aria-label={t("logout")}
                  title={t("logout")}
                >
                  <SignOutIcon />
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-flex items-center text-sm text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500 px-3 py-1.5 rounded-md transition-colors ml-1"
              >
                {t("login")}
              </Link>
            )}

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="md:hidden p-2 text-zinc-400 hover:text-white transition-colors"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden fixed inset-0 top-14 z-40 bg-zinc-950/95 backdrop-blur-md flex flex-col p-6">
          <nav className="flex flex-col gap-5" aria-label="Mobile navigation">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-lg font-medium transition-colors ${
                  isActive(href) ? "text-green-400" : "text-zinc-200 hover:text-white"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            {comingSoonLinks.map((label) => (
              <span key={label} className="text-lg font-medium text-zinc-600">
                {label}{" "}
                <span className="text-xs text-zinc-700">coming soon</span>
              </span>
            ))}
          </nav>

          <div className="mt-8 border-t border-zinc-800 pt-6 flex flex-col gap-4">
            <CurrencyToggle current={currency} />

            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="text-sm font-medium text-purple-400 hover:text-purple-300 transition-colors"
                    onClick={() => setMenuOpen(false)}
                  >
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  href="/account/orders"
                  className="text-sm text-zinc-300 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  {t("account")}
                </Link>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOut({ callbackUrl: `/${locale}` });
                  }}
                  className="text-left text-sm text-zinc-500 hover:text-red-400 transition-colors"
                >
                  {t("logout")}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm text-zinc-300 hover:text-white transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {t("login")}
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function CartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
    </svg>
  );
}

function AccountIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function SignOutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
