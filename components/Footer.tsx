"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

function ComingSoon({ label, t }: { label: string; t: ReturnType<typeof useTranslations> }) {
  return (
    <span className="flex items-center gap-1.5 text-zinc-600 cursor-default select-none">
      {label}
      <span className="text-[10px] border border-zinc-700 text-zinc-700 rounded px-1 leading-tight">
        {t("comingSoon")}
      </span>
    </span>
  );
}

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();

  const linkCls = "text-zinc-400 hover:text-green-400 transition-colors";

  return (
    <footer className="bg-[#0d0d0d] border-t border-[#2a2a2a] font-mono">
      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* ── 1. Brand ──────────────────────────────────────────────────────── */}
          <div className="space-y-4">
            <Image
              src="/onlydevs_logo.png"
              alt="OnlyDevs"
              width={200}
              height={56}
              className="h-22 w-auto opacity-90"
            />
            <p className="text-xs text-green-500">{t("tagline")}</p>
            <p className="text-xs text-zinc-500 leading-relaxed">{t("description")}</p>
            <div className="flex items-center gap-3 pt-1">
              {/* GitHub */}
              <a
                href="https://github.com/onlydevs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-zinc-500 hover:text-green-400 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                </svg>
              </a>
              {/* Twitter / X */}
              <a
                href="https://x.com/onlydevs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X / Twitter"
                className="text-zinc-500 hover:text-green-400 transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href="https://instagram.com/onlydevs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-zinc-500 hover:text-green-400 transition-colors"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ── 2. Shop ───────────────────────────────────────────────────────── */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-4">
              {t("shopTitle")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className={linkCls}>{t("allProducts")}</Link></li>
              <li><Link href="/products?category=merch" className={linkCls}>{t("merch")}</Link></li>
              <li><Link href="/products?category=tech" className={linkCls}>{t("tech")}</Link></li>
              <li><Link href="/products?category=stickers" className={linkCls}>{t("stickers")}</Link></li>
              <li><ComingSoon label={t("drops")} t={t} /></li>
            </ul>
          </div>

          {/* ── 3. Support ────────────────────────────────────────────────────── */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-4">
              {t("supportTitle")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><ComingSoon label={t("faq")} t={t} /></li>
              <li><ComingSoon label={t("shippingReturns")} t={t} /></li>
              <li><ComingSoon label={t("sizeGuide")} t={t} /></li>
              <li>
                <a href="mailto:onlydevs.shop@gmail.com" className={linkCls}>
                  {t("contact")}
                </a>
              </li>
              <li><Link href="/account/orders" className={linkCls}>{t("trackOrder")}</Link></li>
            </ul>
          </div>

          {/* ── 4. Legal ──────────────────────────────────────────────────────── */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest mb-4">
              {t("legalTitle")}
            </h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/privacy" className={linkCls}>{t("privacy")}</Link></li>
              <li><Link href="/terms" className={linkCls}>{t("terms")}</Link></li>
              <li><ComingSoon label={t("cookies")} t={t} /></li>
              <li><Link href="/account/profile" className={linkCls}>{t("gdpr")}</Link></li>
            </ul>
          </div>
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────────────── */}
        <div className="border-t border-[#2a2a2a] mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <span>{t("rights", { year })}</span>
          <span>Made with ☕ + {"{ }"} in 🇨🇭</span>
          <span>Visa · Mastercard · TWINT · PayPal · SEPA</span>
        </div>
      </div>
    </footer>
  );
}
