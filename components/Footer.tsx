"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import Cookies from "js-cookie";
import { CURRENCY_COOKIE, parseCurrencyCookie } from "@/lib/currency";

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

// ── Payment badge wrapper ────────────────────────────────────────────────────

function PCard({ bg = "#fff", noBorder = false, children }: {
  bg?: string;
  noBorder?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-[3px] shrink-0 overflow-hidden ${!noBorder ? "border border-zinc-300" : ""}`}
      style={{ background: bg, width: 36, height: 24 }}
    >
      {children}
    </div>
  );
}

// ── Individual payment icons ─────────────────────────────────────────────────

function TwintIcon() {
  return (
    <PCard bg="#000" noBorder>
      <svg viewBox="0 0 52 34" width="36" height="24" fill="none">
        <text x="26" y="22" textAnchor="middle" fill="white"
          fontSize="13" fontWeight="900" fontFamily="Arial,Helvetica,sans-serif" letterSpacing="1">
          TWINT
        </text>
      </svg>
    </PCard>
  );
}


function VisaIcon() {
  return (
    <PCard>
      <svg viewBox="0 0 52 34" width="36" height="24" fill="none">
        <text x="26" y="23" textAnchor="middle" fill="#1A1F71"
          fontSize="17" fontWeight="900" fontFamily="Arial,Helvetica,sans-serif" fontStyle="italic">
          VISA
        </text>
      </svg>
    </PCard>
  );
}

function MastercardIcon() {
  return (
    <PCard>
      <svg viewBox="0 0 52 34" width="36" height="24" fill="none">
        <circle cx="19.5" cy="17" r="10" fill="#EB001B" />
        <circle cx="32.5" cy="17" r="10" fill="#F79E1B" />
        <path d="M26 8.4a10 10 0 0 1 0 17.2A10 10 0 0 1 26 8.4z" fill="#FF5F00" />
      </svg>
    </PCard>
  );
}

function AmexIcon() {
  return (
    <PCard bg="#006FCF" noBorder>
      <svg viewBox="0 0 52 34" width="36" height="24" fill="none">
        <text x="26" y="21" textAnchor="middle" fill="white"
          fontSize="14" fontWeight="900" fontFamily="Arial,Helvetica,sans-serif" letterSpacing="1.5">
          AMEX
        </text>
      </svg>
    </PCard>
  );
}


function MaestroIcon() {
  return (
    <PCard>
      <svg viewBox="0 0 52 34" width="36" height="24" fill="none">
        <circle cx="19.5" cy="17" r="10" fill="#CC0000" />
        <circle cx="32.5" cy="17" r="10" fill="#0066CC" opacity="0.9" />
        <path d="M26 8.4a10 10 0 0 1 0 17.2A10 10 0 0 1 26 8.4z" fill="#6600AA" opacity="0.55" />
      </svg>
    </PCard>
  );
}

function ApplePayIcon() {
  return (
    <PCard bg="#000" noBorder>
      <svg viewBox="0 0 52 34" width="36" height="24" fill="none">
        {/* Apple logo path (simple-icons, 24×24 viewBox → scaled + translated) */}
        <g transform="translate(5, 6) scale(0.84)" fill="white">
          <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
        </g>
        <text x="40" y="22" textAnchor="middle" fill="white"
          fontSize="13" fontFamily="'Helvetica Neue',Arial,sans-serif" fontWeight="300">
          Pay
        </text>
      </svg>
    </PCard>
  );
}

function GooglePayIcon() {
  return (
    <PCard>
      <svg viewBox="0 0 52 34" width="36" height="24" fill="none">
        <text x="16" y="23" textAnchor="middle" fill="#4285F4"
          fontSize="16" fontWeight="500" fontFamily="'Roboto',Arial,sans-serif">G</text>
        <text x="35" y="23" textAnchor="middle" fill="#5F6368"
          fontSize="14" fontWeight="500" fontFamily="'Roboto',Arial,sans-serif">Pay</text>
      </svg>
    </PCard>
  );
}

// ── Footer ───────────────────────────────────────────────────────────────────

export default function Footer() {
  const t = useTranslations("footer");
  const year = new Date().getFullYear();
  // Default true — this is a Swiss store. Hide TWINT/PFPay only when
  // the visitor has explicitly set EUR via a non-Swiss shipping address.
  const [isSwiss, setIsSwiss] = useState(true);

  useEffect(() => {
    const raw = Cookies.get(CURRENCY_COOKIE);
    const currency = parseCurrencyCookie(raw);
    if (currency === "EUR") setIsSwiss(false);
  }, []);

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
              {/* TikTok */}
              <a
                href="https://tiktok.com/@onlydevs.shop"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
                className="text-zinc-500 hover:text-green-400 transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
                </svg>
              </a>
              {/* Twitter / X */}
              <a
                href="https://x.com/onlydevs_shop"
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
                href="https://instagram.com/onlydevs.shop"
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
              <li><Link href="/cookies" className={linkCls}>{t("cookies")}</Link></li>
              <li><Link href="/account/profile" className={linkCls}>{t("gdpr")}</Link></li>
            </ul>
          </div>
        </div>

        {/* ── Payment icons — above footer line, centered ─────────────────── */}
        <div className="mt-10 flex items-center justify-center gap-1.5 flex-wrap">
          {isSwiss && <TwintIcon />}
          <VisaIcon />
          <MastercardIcon />
          <AmexIcon />
          <MaestroIcon />
          <ApplePayIcon />
          <GooglePayIcon />
        </div>

        {/* ── Bottom bar ────────────────────────────────────────────────────── */}
        <div className="border-t border-[#2a2a2a] mt-6 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <span>{t("rights", { year })}</span>
          <span>Made with ☕ + {"{ }"} in 🇨🇭</span>
        </div>
      </div>
    </footer>
  );
}
