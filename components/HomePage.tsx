"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";
import { formatPrice } from "@/lib/currency";
import type { PrintfulProduct } from "@/lib/printful";
import type { Currency } from "@/lib/currency";

const COMMAND = "$ npm install @onlydevs/swag";
const CHAR_DELAY = 50;
const CURSOR_DELAY = 500;
const AUTO_SCROLL_MS = 5000;

interface Props {
  featured: PrintfulProduct[];
  currency: Currency;
}

type Phase = "cursor" | "typing" | "showing";

export default function HomePage({ featured, currency }: Props) {
  const t = useTranslations("home");
  const tp = useTranslations("products");
  const contentRef = useRef<HTMLElement>(null);
  const startRef = useRef(0);

  const [typed, setTyped] = useState("");
  const [phase, setPhase] = useState<Phase>("cursor");

  useEffect(() => {
    startRef.current = Date.now();
    const id = setTimeout(() => setPhase("typing"), CURSOR_DELAY);
    return () => clearTimeout(id);
  }, []);

  useEffect(() => {
    if (phase !== "typing") return;
    if (typed.length >= COMMAND.length) {
      setPhase("showing");
      return;
    }
    const id = setTimeout(
      () => setTyped(COMMAND.slice(0, typed.length + 1)),
      CHAR_DELAY
    );
    return () => clearTimeout(id);
  }, [phase, typed]);

  useEffect(() => {
    if (phase !== "showing") return;
    const elapsed = Date.now() - startRef.current;
    const remaining = Math.max(AUTO_SCROLL_MS - elapsed, 800);
    const id = setTimeout(scrollDown, remaining);
    return () => clearTimeout(id);
  }, [phase]);

  function scrollDown() {
    contentRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div>
      {/* ── Splash ────────────────────────────────────────────────────── */}
      <section className="relative flex h-[calc(100vh-3.5rem)] md:h-[calc(100vh-60px)] flex-col items-center justify-center px-6 overflow-hidden">

        {/* Terminal block */}
        <div className="w-full max-w-lg font-mono mb-10">
          <div className="flex items-center gap-1.5 mb-2 px-1">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-400/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
            <span className="ml-3 text-xs text-zinc-600 select-none">terminal</span>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg px-5 py-4">
            <span className="text-zinc-500 text-sm mr-2 select-none">~</span>
            <span className="text-green-400 text-sm">{typed}</span>
            <span
              className={`inline-block w-[2px] h-[14px] bg-green-400 ml-0.5 align-middle ${
                phase === "showing" ? "opacity-0" : "splash-cursor"
              }`}
            />
          </div>
        </div>

        {/* Logo + tagline + CTA — mount only when typing is done */}
        {phase === "showing" && (
          <div className="text-center select-none">
            <Image
              src="/onlydevs_logo.png"
              alt="OnlyDevs"
              width={300}
              height={84}
              className="h-20 w-auto mx-auto mb-5 splash-item"
              style={{ animationDelay: "0ms" }}
              priority
            />
            <p
              className="font-mono text-green-500 text-sm mb-8 splash-item"
              style={{ animationDelay: "180ms" }}
            >
              {t("tagline")}
            </p>
            <button
              onClick={scrollDown}
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-6 py-3 rounded-md transition-colors text-sm splash-item"
              style={{ animationDelay: "360ms" }}
            >
              {t("enterStore")}
              <ArrowDown />
            </button>
          </div>
        )}

        {/* Scroll hint */}
        {phase === "showing" && (
          <div
            className="absolute bottom-7 text-zinc-600 splash-item"
            style={{
              animationDelay: "700ms",
              animation:
                "splash-fade-up 0.4s ease-out 700ms forwards, splash-bounce 1.4s ease-in-out 1.2s infinite",
            }}
          >
            <ChevronDown />
          </div>
        )}
      </section>

      {/* ── Homepage content ──────────────────────────────────────────── */}
      <section ref={contentRef} id="home-content">

        {/* 1 · Featured products */}
        <div className="max-w-6xl mx-auto px-6 py-20 border-t border-zinc-800">
          <div className="flex items-baseline justify-between mb-10">
            <h2 className="font-mono text-green-400 text-base font-semibold">
              {t("featuredTitle")}
            </h2>
            <Link
              href="/products"
              className="font-mono text-xs text-zinc-500 hover:text-green-400 transition-colors"
            >
              {t("viewAll")}
            </Link>
          </div>

          {featured.length === 0 ? (
            <p className="font-mono text-xs text-zinc-600">{tp("comingSoon")}</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {featured.map((p) => (
                <Link
                  key={p.id}
                  href={`/products/${p.slug}`}
                  className="group bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-green-500/50 transition-colors"
                >
                  {p.thumbnail_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.thumbnail_url}
                      alt={p.name}
                      className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full aspect-square bg-zinc-800 flex items-center justify-center">
                      <span className="font-mono text-zinc-600 text-xs">no image</span>
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-sm group-hover:text-green-400 transition-colors line-clamp-2 mb-1">
                      {p.name}
                    </h3>
                    {p.lowestPriceCents && (
                      <p className="font-mono text-xs text-zinc-500">
                        {tp("from")}{" "}
                        {formatPrice(
                          currency === "CHF"
                            ? p.lowestPriceCents.chf
                            : p.lowestPriceCents.eur,
                          currency
                        )}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* 2 · Categories */}
        <div className="max-w-6xl mx-auto px-6 py-16 border-t border-zinc-800">
          <h2 className="font-mono text-green-400 text-base font-semibold mb-10">
            {t("categoriesTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {(["merch", "tech", "stickers"] as const).map((cat) => (
              <Link
                key={cat}
                href={`/products?category=${cat}`}
                className="group flex flex-col gap-3 bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-green-500/50 transition-colors"
              >
                <span className="text-2xl">{catEmoji(cat)}</span>
                <div>
                  <h3 className="font-semibold text-sm group-hover:text-green-400 transition-colors">
                    {t(`category${cap(cat)}`)}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-0.5 font-mono">
                    {t(`category${cap(cat)}Desc`)}
                  </p>
                </div>
                <span className="font-mono text-xs text-green-600 group-hover:text-green-400 transition-colors">
                  cd ./{cat} →
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* 3 · Value props */}
        <div className="max-w-6xl mx-auto px-6 py-16 border-t border-zinc-800">
          <h2 className="font-mono text-green-400 text-base font-semibold mb-10">
            {t("whyTitle")}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
            {([1, 2, 3] as const).map((n) => (
              <div key={n} className="space-y-2">
                <p className="font-mono text-green-600 text-xs mb-3">
                  {String(n).padStart(2, "0")}.
                </p>
                <h3 className="font-semibold text-sm">{t(`prop${n}Title`)}</h3>
                <p className="font-mono text-xs text-zinc-500 leading-relaxed">
                  {t(`prop${n}Desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 4 · Newsletter */}
        <div className="border-t border-zinc-800">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="font-mono text-green-400 text-base font-semibold mb-2">
              {t("newsletterTitle")}
            </h2>
            <p className="font-mono text-sm text-zinc-500 mb-6">
              {t("newsletterDesc")}
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-3 max-w-md">
              <input
                type="email"
                placeholder={t("newsletterPlaceholder")}
                className="flex-1 bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2.5 text-sm font-mono text-zinc-300 placeholder:text-zinc-600 focus:outline-none focus:border-green-500 transition-colors"
              />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2.5 rounded-md text-sm transition-colors whitespace-nowrap"
              >
                {t("newsletterCta")}
              </button>
            </form>
            <p className="font-mono text-xs text-zinc-700 mt-3">
              {t("newsletterNote")}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function catEmoji(cat: string) {
  if (cat === "merch") return "👕";
  if (cat === "tech") return "💻";
  return "🎨";
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function ArrowDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 5v14M5 12l7 7 7-7" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}
