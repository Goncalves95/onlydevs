// TODO: i18n — currently English only; translate when legal review is complete per locale
import type { Metadata } from "next";
import { Link } from "@/lib/i18n/navigation";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "What cookies OnlyDevs uses and why.",
};

const TOC = [
  { id: "what-are-cookies",   label: "What Are Cookies" },
  { id: "cookies-we-use",     label: "Cookies We Use" },
  { id: "no-tracking",        label: "What We Don't Do" },
  { id: "manage-cookies",     label: "Managing Cookies" },
  { id: "updates",            label: "Policy Updates" },
  { id: "contact",            label: "Contact" },
];

export default function CookiesPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">

      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-green-500 text-xs mb-3">// legal.cookie_policy</p>
        <h1 className="text-3xl font-bold mb-3">Cookie Policy</h1>
        <p className="font-mono text-xs text-zinc-500">
          Last updated: June 2025 &nbsp;·&nbsp; Governing law: Switzerland (nLPD)
        </p>
      </div>

      {/* Minimal banner note */}
      <div className="mb-10 flex gap-3 items-start p-4 bg-green-950/30 border border-green-900/50 rounded-lg">
        <span className="font-mono text-green-500 text-sm shrink-0 select-none mt-0.5">✓</span>
        <p className="text-sm text-zinc-300">
          OnlyDevs uses <strong className="text-zinc-100">only strictly necessary cookies</strong>.
          No advertising networks, no analytics trackers, no third-party profiling.
          No consent is required under EU and Swiss law for strictly necessary cookies.
        </p>
      </div>

      {/* TOC */}
      <nav
        aria-label="Table of contents"
        className="mb-12 p-5 bg-zinc-900 border border-zinc-800 rounded-lg"
      >
        <p className="font-mono text-xs text-zinc-500 mb-4">// table.of.contents</p>
        <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {TOC.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="font-mono text-sm text-zinc-400 hover:text-green-400 transition-colors"
              >
                <span className="text-zinc-600 mr-2">{String(i + 1).padStart(2, "0")}.</span>
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      {/* Sections */}
      <div className="space-y-14 text-sm leading-relaxed">

        {/* 1 */}
        <section id="what-are-cookies" className="scroll-mt-20">
          <Heading n={1} slug="what_are_cookies" title="What Are Cookies" />
          <p className="text-zinc-300 mb-3">
            Cookies are small text files stored in your browser when you visit a website. They allow
            the site to remember information across pages or between visits — such as whether you are
            signed in, what is in your cart, or your language preference.
          </p>
          <p className="text-zinc-400">
            Cookies are categorised by purpose and duration:
          </p>
          <ul className="mt-3 space-y-2 text-zinc-400">
            {[
              { term: "Session cookies", def: "Deleted when you close your browser tab." },
              { term: "Persistent cookies", def: "Remain until their expiry date or until you delete them." },
              { term: "Strictly necessary", def: "Required for the site to function. No consent needed." },
              { term: "Analytics / marketing", def: "Track behaviour for advertising or measurement. OnlyDevs does NOT use these." },
            ].map(({ term, def }) => (
              <li key={term} className="flex gap-2">
                <span className="text-green-600 font-mono shrink-0 select-none">→</span>
                <span><strong className="text-zinc-300">{term}:</strong> {def}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 2 */}
        <section id="cookies-we-use" className="scroll-mt-20">
          <Heading n={2} slug="cookies_we_use" title="Cookies We Use" />
          <p className="text-zinc-300 mb-4">
            The following table lists every cookie set by OnlyDevs:
          </p>
          <div className="overflow-x-auto rounded-lg border border-zinc-800">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-zinc-800">
                  {["Name", "Purpose", "Duration", "Type"].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-2.5 font-mono text-zinc-500 bg-zinc-900/60"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    name: "authjs.session-token",
                    purpose: "Keeps you signed in to your account",
                    duration: "30 days",
                    type: "Strictly necessary",
                  },
                  {
                    name: "authjs.csrf-token",
                    purpose: "Prevents cross-site request forgery attacks",
                    duration: "Session",
                    type: "Strictly necessary",
                  },
                  {
                    name: "authjs.callback-url",
                    purpose: "Remembers where to redirect after sign-in",
                    duration: "Session",
                    type: "Strictly necessary",
                  },
                  {
                    name: "onlydevs-currency",
                    purpose: "Remembers your selected currency (CHF or EUR)",
                    duration: "1 year",
                    type: "Strictly necessary",
                  },
                  {
                    name: "onlydevs_cookie_consent",
                    purpose: "Records that you have acknowledged this cookie notice",
                    duration: "Persistent (localStorage)",
                    type: "Strictly necessary",
                  },
                ].map((row, i) => (
                  <tr
                    key={row.name}
                    className={`border-b border-zinc-800/60 last:border-0 ${
                      i % 2 === 0 ? "bg-zinc-900/20" : "bg-zinc-900/40"
                    }`}
                  >
                    <td className="px-4 py-3 font-mono text-green-400 whitespace-nowrap align-top">
                      {row.name}
                    </td>
                    <td className="px-4 py-3 text-zinc-400 align-top">{row.purpose}</td>
                    <td className="px-4 py-3 text-zinc-400 whitespace-nowrap align-top">{row.duration}</td>
                    <td className="px-4 py-3 align-top">
                      <span className="font-mono text-xs text-green-600 bg-green-950/40 border border-green-900/40 rounded px-1.5 py-0.5 whitespace-nowrap">
                        {row.type}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-zinc-500 mt-4 text-xs font-mono">
            // Cart state is stored in your browser&apos;s localStorage, not in a cookie.
          </p>
        </section>

        {/* 3 */}
        <section id="no-tracking" className="scroll-mt-20">
          <Heading n={3} slug="what_we_dont_do" title="What We Don't Do" />
          <p className="text-zinc-300 mb-4">
            OnlyDevs deliberately avoids the following:
          </p>
          <div className="space-y-2">
            {[
              "Google Analytics or any behavioural analytics platform",
              "Facebook Pixel, TikTok Pixel, or any advertising network",
              "Hotjar, FullStory, or session recording tools",
              "Cross-site tracking or fingerprinting",
              "Selling or sharing your browsing data with third parties",
            ].map((item) => (
              <div key={item} className="flex gap-2 items-start">
                <span className="font-mono text-red-500 shrink-0 select-none text-xs mt-0.5">✗</span>
                <p className="text-zinc-400 text-sm">{item}</p>
              </div>
            ))}
          </div>
          <p className="text-zinc-500 mt-4 text-xs font-mono">
            // Our network requests are limited to Stripe (payments) and Printful (fulfillment).
          </p>
        </section>

        {/* 4 */}
        <section id="manage-cookies" className="scroll-mt-20">
          <Heading n={4} slug="managing_cookies" title="Managing Cookies" />
          <p className="text-zinc-300 mb-4">
            Because we only use strictly necessary cookies, blocking them will affect the
            functionality of the store:
          </p>
          <div className="space-y-3">
            {[
              {
                action: "Block all cookies",
                result: "You will not be able to sign in or maintain a session. Cart state may be lost on navigation.",
                impact: "high",
              },
              {
                action: "Delete session cookie",
                result: "You will be signed out immediately.",
                impact: "medium",
              },
              {
                action: "Delete currency cookie",
                result: "Currency will reset to the locale default (CHF for Swiss locales, EUR for others).",
                impact: "low",
              },
            ].map((row) => (
              <div
                key={row.action}
                className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/40"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <p className="font-semibold text-zinc-200 text-xs">{row.action}</p>
                  <span
                    className={`font-mono text-xs px-1.5 py-0.5 rounded border ${
                      row.impact === "high"
                        ? "text-red-400 border-red-900/60 bg-red-950/30"
                        : row.impact === "medium"
                        ? "text-yellow-400 border-yellow-900/60 bg-yellow-950/30"
                        : "text-zinc-400 border-zinc-700 bg-zinc-800/40"
                    }`}
                  >
                    {row.impact} impact
                  </span>
                </div>
                <p className="text-xs text-zinc-400">{row.result}</p>
              </div>
            ))}
          </div>
          <p className="text-zinc-400 mt-5 text-sm">
            To manage cookies, use your browser settings:
          </p>
          <ul className="mt-2 space-y-1 text-zinc-500 text-xs font-mono">
            {[
              { browser: "Chrome",  path: "Settings → Privacy and security → Cookies" },
              { browser: "Firefox", path: "Settings → Privacy & Security → Cookies and Site Data" },
              { browser: "Safari",  path: "Settings → Privacy → Manage Website Data" },
              { browser: "Edge",    path: "Settings → Cookies and site permissions" },
            ].map(({ browser, path }) => (
              <li key={browser} className="flex gap-2">
                <span className="text-green-600 shrink-0">→</span>
                <span><span className="text-zinc-300">{browser}:</span> {path}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 5 */}
        <section id="updates" className="scroll-mt-20">
          <Heading n={5} slug="policy_updates" title="Policy Updates" />
          <p className="text-zinc-300">
            We may update this Cookie Policy when we change our technical stack or as legal
            requirements evolve. The &ldquo;Last updated&rdquo; date at the top of this page reflects the most
            recent revision. We will not introduce non-essential cookies without updating this page
            and, where required by law, obtaining your explicit consent.
          </p>
        </section>

        {/* 6 */}
        <section id="contact" className="scroll-mt-20">
          <Heading n={6} slug="contact" title="Contact" />
          <p className="text-zinc-300 mb-4">
            Questions about this policy or our use of cookies:
          </p>
          <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-5 font-mono text-sm space-y-2">
            <p>
              <span className="text-zinc-600 select-none">email    </span>
              <a href="mailto:onlydevs.shop@gmail.com" className="text-green-400 hover:underline">
                onlydevs.shop@gmail.com
              </a>
            </p>
            <p>
              <span className="text-zinc-600 select-none">website  </span>
              <a href="https://onlydevs.shop" target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                onlydevs.shop
              </a>
            </p>
          </div>
        </section>

      </div>

      {/* Footer nav */}
      <div className="mt-16 pt-8 border-t border-zinc-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 font-mono text-xs text-zinc-600">
        <a href="#" className="hover:text-green-400 transition-colors">↑ back to top</a>
        <div className="flex gap-4">
          <Link href="/privacy" className="hover:text-green-400 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-green-400 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </main>
  );
}

function Heading({ n, slug, title }: { n: number; slug: string; title: string }) {
  return (
    <div className="mb-4">
      <p className="font-mono text-green-600 text-xs mb-1">
        // {String(n).padStart(2, "0")}.{slug}
      </p>
      <h2 className="text-lg font-bold text-zinc-100">{title}</h2>
    </div>
  );
}
