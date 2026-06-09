import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });
  return {
    title: t("metaTitle"),
    description: t("metaDesc"),
  };
}

const STACK = [
  { group: "Frontend",     items: ["Next.js 15", "TypeScript", "Tailwind CSS", "next-intl"] },
  { group: "Auth",         items: ["Auth.js v5", "Prisma 7", "Supabase"] },
  { group: "Commerce",     items: ["Stripe", "Printful", "Resend"] },
  { group: "Infra",        items: ["Vercel", "Upstash Redis"] },
] as const;

const VALUES = [
  {
    icon: "✦",
    key: "value1" as const,
  },
  {
    icon: "◈",
    key: "value2" as const,
  },
  {
    icon: "⬡",
    key: "value3" as const,
  },
] as const;

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "about" });

  return (
    <main className="max-w-4xl mx-auto px-6 py-20">

      {/* ── 1. Hero ──────────────────────────────────────────────────── */}
      <section className="mb-24">
        <p className="font-mono text-green-500 text-sm mb-4">// about.onlydevs</p>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6 leading-tight">
          {t("heroSubtitle")}
        </h1>
        <p className="text-zinc-400 text-lg leading-relaxed max-w-2xl">
          {t("heroBody")}
        </p>
      </section>

      {/* ── 2. Our Story ─────────────────────────────────────────────── */}
      <section className="mb-24">
        <p className="font-mono text-green-600 text-xs mb-3">// our.story</p>
        <h2 className="text-2xl font-bold mb-8">{t("storyTitle")}</h2>
        <div className="space-y-5 text-zinc-400 leading-relaxed max-w-2xl">
          <p>{t("storyP1")}</p>
          <p>{t("storyP2")}</p>
          <p>{t("storyP3")}</p>
        </div>
      </section>

      {/* ── 3. Values ────────────────────────────────────────────────── */}
      <section className="mb-24">
        <p className="font-mono text-green-600 text-xs mb-3">// what.we.stand.for</p>
        <h2 className="text-2xl font-bold mb-10">{t("valuesTitle")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {VALUES.map(({ icon, key }) => (
            <div
              key={key}
              className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 hover:border-zinc-700 transition-colors"
            >
              <span className="text-green-500 text-2xl block mb-4 select-none">{icon}</span>
              <h3 className="font-semibold text-zinc-100 mb-2">
                {t(`${key}Title`)}
              </h3>
              <p className="text-sm text-zinc-500 leading-relaxed font-mono">
                {t(`${key}Desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 4. The Stack ─────────────────────────────────────────────── */}
      <section className="mb-24">
        <p className="font-mono text-green-600 text-xs mb-3">// our.stack</p>
        <h2 className="text-2xl font-bold mb-3">{t("stackTitle")}</h2>
        <p className="text-zinc-500 text-sm font-mono mb-10">{t("stackNote")}</p>
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {STACK.map(({ group, items }) => (
              <div key={group}>
                <p className="font-mono text-xs text-zinc-600 mb-3">{group.toLowerCase()}:</p>
                <div className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <span
                      key={item}
                      className="font-mono text-xs bg-zinc-800 border border-zinc-700 text-zinc-300 px-2.5 py-1 rounded"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="font-mono text-xs text-zinc-700 mt-6 pt-4 border-t border-zinc-800">
            // Yes, we dogfood our own stack.
          </p>
        </div>
      </section>

      {/* ── 5. Location ──────────────────────────────────────────────── */}
      <section className="mb-24">
        <p className="font-mono text-green-600 text-xs mb-3">// where.we.are</p>
        <h2 className="text-2xl font-bold mb-6">{t("locationTitle")}</h2>
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex-1">
            <p className="text-4xl mb-4">🇨🇭</p>
            <p className="font-semibold text-zinc-100 mb-1">Zürich, Switzerland</p>
            <p className="text-sm text-zinc-500 font-mono">{t("locationText")}</p>
          </div>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 flex-1">
            <p className="text-4xl mb-4">🚚</p>
            <p className="font-semibold text-zinc-100 mb-1">{t("shipsTitle")}</p>
            <p className="text-sm text-zinc-500 font-mono">{t("shipsText")}</p>
          </div>
        </div>
      </section>

      {/* ── 6. Contact CTA ───────────────────────────────────────────── */}
      <section className="border-t border-zinc-800 pt-16">
        <p className="font-mono text-green-600 text-xs mb-3">// get.in.touch</p>
        <h2 className="text-2xl font-bold mb-3">{t("contactTitle")}</h2>
        <p className="text-zinc-400 leading-relaxed mb-8 max-w-lg">{t("contactText")}</p>

        <div className="flex flex-wrap gap-4 mb-10">
          <a
            href="mailto:onlydevs.shop@gmail.com"
            className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold px-5 py-2.5 rounded-md transition-colors text-sm font-mono"
          >
            <EnvelopeIcon />
            onlydevs.shop@gmail.com
          </a>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white px-5 py-2.5 rounded-md transition-colors text-sm font-mono"
          >
            {t("shopCta")}
          </Link>
        </div>

        {/* Socials */}
        <div className="flex items-center gap-5">
          <SocialLink href="https://github.com/onlydevs" label="GitHub">
            <GitHubIcon />
          </SocialLink>
          <SocialLink href="https://x.com/onlydevs" label="X / Twitter">
            <XIcon />
          </SocialLink>
          <SocialLink href="https://instagram.com/onlydevs" label="Instagram">
            <InstagramIcon />
          </SocialLink>
        </div>
      </section>
    </main>
  );
}

/* ── Local helpers ───────────────────────────────────────────────────────── */

function SocialLink({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-zinc-500 hover:text-green-400 transition-colors"
    >
      {children}
    </a>
  );
}

function EnvelopeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}
