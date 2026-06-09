// TODO: i18n — currently English only; translate when legal review is complete per locale
import type { Metadata } from "next";
import { Link } from "@/lib/i18n/navigation";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How OnlyDevs collects, uses and protects your personal data.",
};

const TOC = [
  { id: "who-we-are",      label: "Who We Are" },
  { id: "data-collected",  label: "Data Collected" },
  { id: "how-we-use",      label: "How We Use It" },
  { id: "third-parties",   label: "Third-Party Services" },
  { id: "data-retention",  label: "Data Retention" },
  { id: "your-rights",     label: "Your Rights" },
  { id: "cookies",         label: "Cookies" },
  { id: "contact",         label: "Contact & Complaints" },
];

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">

      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-green-500 text-xs mb-3">// legal.privacy_policy</p>
        <h1 className="text-3xl font-bold mb-3">Privacy Policy</h1>
        <p className="font-mono text-xs text-zinc-500">
          Last updated: June 2025 &nbsp;·&nbsp; Governing law: Switzerland (nLPD)
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
        <section id="who-we-are" className="scroll-mt-20">
          <Heading n={1} slug="who.we.are" title="Who We Are" />
          <p className="text-zinc-300">
            OnlyDevs is a developer-focused merchandise store operated under the brand{" "}
            <strong className="text-zinc-100">OnlyDevs — RaigonLab</strong>, accessible at{" "}
            <ExternalLink href="https://onlydevs.shop">onlydevs.shop</ExternalLink>. We are based
            in Switzerland and subject to the Swiss Federal Act on Data Protection (nLPD) and, where
            applicable to EU residents, the General Data Protection Regulation (GDPR).
          </p>
          <p className="text-zinc-400 mt-3">
            For any privacy-related enquiries contact us at{" "}
            <a href="mailto:onlydevs.shop@gmail.com" className="text-green-400 hover:underline">
              onlydevs.shop@gmail.com
            </a>.
          </p>
        </section>

        {/* 2 */}
        <section id="data-collected" className="scroll-mt-20">
          <Heading n={2} slug="data.collected" title="Data We Collect" />
          <p className="text-zinc-300 mb-4">
            We collect only the personal data necessary to operate the store:
          </p>
          <DataTable
            rows={[
              ["Name",             "Account registration and order fulfillment"],
              ["Email address",    "Account sign-in, order confirmation, transactional emails"],
              ["Shipping address", "Order fulfillment via Printful"],
              ["Order history",    "Order management and customer support"],
              ["Payment data",     "Processed entirely by Stripe — OnlyDevs never stores card details"],
            ]}
          />
          <Comment>We do not use tracking pixels, advertising cookies, or behavioural analytics.</Comment>
        </section>

        {/* 3 */}
        <section id="how-we-use" className="scroll-mt-20">
          <Heading n={3} slug="how.we.use.your.data" title="How We Use Your Data" />
          <p className="text-zinc-300 mb-4">Your data is used exclusively for:</p>
          <ul className="space-y-2 text-zinc-400">
            {[
              "Processing and fulfilling your orders",
              "Managing your account (sign-in, profile, order history)",
              "Sending transactional emails (order confirmation, shipping updates)",
              "Responding to support and GDPR requests",
              "Complying with legal obligations under Swiss law",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-green-600 font-mono shrink-0 select-none">→</span>
                {item}
              </li>
            ))}
          </ul>
          <Comment>We do not sell, rent, or share your data for marketing purposes.</Comment>
        </section>

        {/* 4 */}
        <section id="third-parties" className="scroll-mt-20">
          <Heading n={4} slug="third.party.services" title="Third-Party Services" />
          <p className="text-zinc-300 mb-5">
            We use the following sub-processors. Each handles your data only as necessary for their
            service and has its own privacy policy:
          </p>
          <div className="space-y-3">
            {[
              {
                name: "Stripe",
                role: "Payment processing",
                url: "https://stripe.com/privacy",
                note: "Handles all card data. PCI-DSS Level 1 certified. OnlyDevs receives only a payment confirmation token.",
              },
              {
                name: "Printful",
                role: "Order fulfillment & printing",
                url: "https://printful.com/policies/privacy",
                note: "Receives your name and shipping address to produce and ship your order.",
              },
              {
                name: "Resend",
                role: "Transactional email delivery",
                url: "https://resend.com/privacy",
                note: "Sends order confirmation and account-related emails on our behalf.",
              },
              {
                name: "Supabase",
                role: "Database hosting",
                url: "https://supabase.com/privacy",
                note: "Stores account, order, and address data. Hosted in EU region.",
              },
              {
                name: "Vercel",
                role: "Application hosting & CDN",
                url: "https://vercel.com/legal/privacy-policy",
                note: "Hosts the OnlyDevs application and CDN. Processes standard HTTP request logs.",
              },
            ].map((sp) => (
              <div
                key={sp.name}
                className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/40"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-zinc-200">{sp.name}</span>
                  <a
                    href={sp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-xs text-green-500 hover:text-green-400 transition-colors"
                  >
                    Privacy Policy ↗
                  </a>
                </div>
                <p className="font-mono text-xs text-zinc-600 mb-1">{sp.role}</p>
                <p className="text-xs text-zinc-400">{sp.note}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5 */}
        <section id="data-retention" className="scroll-mt-20">
          <Heading n={5} slug="data.retention" title="Data Retention" />
          <DataTable
            headers={["Data type", "Retention period", "Reason"]}
            rows={[
              ["Order records",     "10 years",                    "Swiss commercial law (OR Art. 958f)"],
              ["Account data",      "Until deletion requested",    "Deleted on request via account settings"],
              ["Session tokens",    "30 days",                     "Expired automatically"],
              ["Server logs",       "30 days",                     "Vercel standard log retention"],
            ]}
          />
          <p className="text-zinc-400 mt-4">
            You can request deletion of your account and personal data at any time from your{" "}
            <Link href="/account/profile" className="text-green-400 hover:underline">
              profile page
            </Link>
            . Order records subject to legal retention cannot be deleted early.
          </p>
        </section>

        {/* 6 */}
        <section id="your-rights" className="scroll-mt-20">
          <Heading n={6} slug="your.rights.gdpr.nlpd" title="Your Rights (GDPR + nLPD)" />
          <p className="text-zinc-300 mb-5">
            Under the Swiss nLPD and the EU GDPR you have the following rights:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              {
                right: "Right to access",
                desc: "Receive a copy of all personal data we hold about you.",
                action: "Profile → Download my data",
              },
              {
                right: "Right to erasure",
                desc: "Request permanent deletion of your account and personal data.",
                action: "Profile → Delete my account",
              },
              {
                right: "Right to portability",
                desc: "Receive your data in a structured, machine-readable format (JSON).",
                action: "Profile → Download my data",
              },
              {
                right: "Right to rectification",
                desc: "Correct any inaccurate personal data we hold about you.",
                action: "Update profile or email us",
              },
              {
                right: "Right to object",
                desc: "Object to the processing of your personal data.",
                action: "Email onlydevs.shop@gmail.com",
              },
              {
                right: "Right to restrict",
                desc: "Request restriction of processing in certain circumstances.",
                action: "Email onlydevs.shop@gmail.com",
              },
            ].map((r) => (
              <div
                key={r.right}
                className="border border-zinc-800 rounded-lg p-4 bg-zinc-900/40"
              >
                <p className="font-semibold text-zinc-200 text-xs mb-1">{r.right}</p>
                <p className="text-xs text-zinc-400 mb-2">{r.desc}</p>
                <p className="font-mono text-xs text-green-600">→ {r.action}</p>
              </div>
            ))}
          </div>
          <p className="text-zinc-500 mt-4 text-xs">
            We respond to all requests within 30 days. For complaints, you may contact the{" "}
            <ExternalLink href="https://www.edoeb.admin.ch">
              Swiss Federal Data Protection Commissioner (FDPIC)
            </ExternalLink>.
          </p>
        </section>

        {/* 7 */}
        <section id="cookies" className="scroll-mt-20">
          <Heading n={7} slug="cookies" title="Cookies" />
          <p className="text-zinc-300 mb-4">
            We use only strictly necessary cookies. No advertising, analytics, or tracking cookies
            are used.
          </p>
          <DataTable
            headers={["Cookie", "Purpose", "Duration"]}
            rows={[
              ["Session",             "Keeps you signed in",                          "Session (cleared on tab close)"],
              ["Cart",                "Persists your shopping cart",                  "30 days"],
              ["Currency preference", "Remembers your selected currency (CHF / EUR)", "1 year"],
            ]}
          />
          <p className="text-zinc-400 mt-4">
            No consent banner is required for these cookies as they are strictly necessary for the
            service to operate (ePrivacy Directive, Art. 5(3) exemption).
          </p>
        </section>

        {/* 8 */}
        <section id="contact" className="scroll-mt-20">
          <Heading n={8} slug="contact.and.complaints" title="Contact & Complaints" />
          <p className="text-zinc-300 mb-4">
            To exercise your rights or ask any privacy-related question:
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
              <ExternalLink href="https://onlydevs.shop">onlydevs.shop</ExternalLink>
            </p>
            <p>
              <span className="text-zinc-600 select-none">law      </span>
              <span className="text-zinc-300">Switzerland (nLPD) · GDPR applies to EU residents</span>
            </p>
          </div>
        </section>

      </div>

      {/* Footer nav */}
      <div className="mt-16 pt-8 border-t border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-600">
        <a href="#" className="hover:text-green-400 transition-colors">↑ back to top</a>
        <Link href="/terms" className="hover:text-green-400 transition-colors">
          Terms of Service →
        </Link>
      </div>
    </main>
  );
}

/* ── Local helpers ────────────────────────────────────────────────────────── */

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

function Comment({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-xs text-zinc-600 mt-4">// {children}</p>
  );
}

function ExternalLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-green-400 hover:underline"
    >
      {children}
    </a>
  );
}

function DataTable({
  headers,
  rows,
}: {
  headers?: string[];
  rows: string[][];
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-zinc-800">
      <table className="w-full text-xs">
        {headers && (
          <thead>
            <tr className="border-b border-zinc-800">
              {headers.map((h) => (
                <th
                  key={h}
                  className="text-left px-4 py-2.5 font-mono text-zinc-500 bg-zinc-900/60"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((row, i) => (
            <tr
              key={i}
              className={`border-b border-zinc-800/60 last:border-0 ${
                i % 2 === 0 ? "bg-zinc-900/20" : "bg-zinc-900/40"
              }`}
            >
              {row.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 align-top ${
                    j === 0
                      ? "font-mono text-zinc-300 whitespace-nowrap"
                      : "text-zinc-400"
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
