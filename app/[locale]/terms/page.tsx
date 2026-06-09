// TODO: i18n — currently English only; translate when legal review is complete per locale
import type { Metadata } from "next";
import { Link } from "@/lib/i18n/navigation";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for purchasing from OnlyDevs.",
};

const TOC = [
  { id: "acceptance",     label: "Acceptance of Terms" },
  { id: "products",       label: "Products" },
  { id: "pricing",        label: "Pricing & VAT" },
  { id: "payment",        label: "Payment" },
  { id: "shipping",       label: "Shipping & Delivery" },
  { id: "returns",        label: "Returns & Refunds" },
  { id: "ip",             label: "Intellectual Property" },
  { id: "liability",      label: "Limitation of Liability" },
  { id: "governing-law",  label: "Governing Law" },
  { id: "contact",        label: "Contact" },
];

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">

      {/* Header */}
      <div className="mb-10">
        <p className="font-mono text-green-500 text-xs mb-3">// legal.terms_of_service</p>
        <h1 className="text-3xl font-bold mb-3">Terms of Service</h1>
        <p className="font-mono text-xs text-zinc-500">
          Last updated: June 2025 &nbsp;·&nbsp; Governing law: Switzerland
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
        <section id="acceptance" className="scroll-mt-20">
          <Heading n={1} slug="acceptance_of_terms" title="Acceptance of Terms" />
          <p className="text-zinc-300">
            By accessing <ExternalLink href="https://onlydevs.shop">onlydevs.shop</ExternalLink>{" "}
            or placing an order, you agree to be bound by these Terms of Service and our{" "}
            <Link href="/privacy" className="text-green-400 hover:underline">Privacy Policy</Link>.
            If you do not agree, please do not use the store.
          </p>
          <p className="text-zinc-400 mt-3">
            These terms are provided by <strong className="text-zinc-200">OnlyDevs — RaigonLab</strong>,
            Switzerland. We reserve the right to update these terms at any time; changes take effect
            upon publication. Continued use of the store after changes constitutes acceptance.
          </p>
        </section>

        {/* 2 */}
        <section id="products" className="scroll-mt-20">
          <Heading n={2} slug="products" title="Products" />
          <p className="text-zinc-300 mb-3">
            All products sold on OnlyDevs are produced on a{" "}
            <strong className="text-zinc-200">print-on-demand</strong> basis through our fulfillment
            partner{" "}
            <ExternalLink href="https://printful.com">Printful</ExternalLink>.
          </p>
          <ul className="space-y-2 text-zinc-400">
            {[
              "No physical inventory is held by OnlyDevs.",
              "Each item is manufactured individually upon order.",
              "Product images are representations — minor colour variations may occur due to screen calibration and print processes.",
              "Sizing charts are provided on individual product pages and should be consulted before ordering.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-green-600 font-mono shrink-0 select-none">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 3 */}
        <section id="pricing" className="scroll-mt-20">
          <Heading n={3} slug="pricing_and_vat" title="Pricing & VAT" />
          <p className="text-zinc-300 mb-3">
            Prices are displayed in <strong className="text-zinc-200">CHF</strong> (Swiss Francs)
            and <strong className="text-zinc-200">EUR</strong> (Euros) and include applicable VAT.
          </p>
          <ul className="space-y-2 text-zinc-400">
            {[
              "Prices are set at checkout and confirmed by email — they do not fluctuate after an order is placed.",
              "Shipping costs are calculated at checkout based on destination and product weight.",
              "Currency conversion is indicative; your bank or payment provider determines the final exchange rate for non-CHF transactions.",
              "We reserve the right to change prices at any time before an order is placed.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-green-600 font-mono shrink-0 select-none">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 4 */}
        <section id="payment" className="scroll-mt-20">
          <Heading n={4} slug="payment" title="Payment" />
          <p className="text-zinc-300 mb-3">
            All payments are processed securely by{" "}
            <ExternalLink href="https://stripe.com">Stripe</ExternalLink>, a PCI-DSS Level 1
            certified payment processor. OnlyDevs does not store, transmit, or have access to your
            card details at any point.
          </p>
          <p className="text-zinc-300">Accepted payment methods:</p>
          <ul className="mt-2 space-y-1 text-zinc-400">
            {["Visa", "Mastercard", "TWINT", "PayPal", "SEPA Direct Debit"].map((m) => (
              <li key={m} className="flex gap-2">
                <span className="text-green-600 font-mono shrink-0 select-none">→</span>
                {m}
              </li>
            ))}
          </ul>
          <p className="text-zinc-400 mt-3">
            Your order is confirmed only after payment is successfully processed. You will receive a
            confirmation email with your order number.
          </p>
        </section>

        {/* 5 */}
        <section id="shipping" className="scroll-mt-20">
          <Heading n={5} slug="shipping_and_delivery" title="Shipping & Delivery" />
          <p className="text-zinc-300 mb-4">
            Orders are fulfilled and shipped by Printful from their EU production facilities.
          </p>
          <DataTable
            headers={["Region", "Estimated delivery", "Notes"]}
            rows={[
              ["Switzerland",    "3–6 business days",  "Customs not applicable (CH inland)"],
              ["European Union", "5–10 business days", "No import duties within EU single market"],
              ["Rest of World",  "7–14 business days", "Import duties may apply — buyer responsible"],
            ]}
          />
          <p className="text-zinc-400 mt-4">
            Delivery times are estimates and not guaranteed. Once an order is dispatched you will
            receive a tracking number by email. OnlyDevs is not responsible for delays caused by
            carriers, customs, or force majeure.
          </p>
        </section>

        {/* 6 */}
        <section id="returns" className="scroll-mt-20">
          <Heading n={6} slug="returns_and_refunds" title="Returns & Refunds" />
          <p className="text-zinc-300 mb-4">
            Because all products are made to order, our return policy is as follows:
          </p>
          <div className="space-y-4">
            <PolicyBlock
              status="accepted"
              title="Defective or incorrect items"
              desc="If you receive a damaged, defective, or incorrect item, contact us within 14 days of delivery with a photo. We will arrange a full replacement or refund at no cost to you."
            />
            <PolicyBlock
              status="accepted"
              title="Wrong size ordered"
              desc="If the item does not match the size you ordered, contact us within 14 days. We will arrange an exchange. You are responsible for return shipping costs."
            />
            <PolicyBlock
              status="rejected"
              title="Change of mind"
              desc="Because products are individually printed on demand, we cannot accept returns or exchanges for change of mind, incorrect size selection, or buyer's remorse. Please consult size guides before ordering."
            />
          </div>
          <p className="text-zinc-400 mt-4 text-xs">
            To initiate a return or report an issue, email{" "}
            <a href="mailto:onlydevs.shop@gmail.com" className="text-green-400 hover:underline">
              onlydevs.shop@gmail.com
            </a>{" "}
            with your order number and a description of the problem.
          </p>
        </section>

        {/* 7 */}
        <section id="ip" className="scroll-mt-20">
          <Heading n={7} slug="intellectual_property" title="Intellectual Property" />
          <p className="text-zinc-300 mb-3">
            All designs, graphics, and content on OnlyDevs are the original work of
            OnlyDevs — RaigonLab and are protected by copyright law.
          </p>
          <ul className="space-y-2 text-zinc-400">
            {[
              "You may not reproduce, distribute, or create derivative works from our designs without written permission.",
              "Third-party trademarks (e.g., programming language logos) are the property of their respective owners and are used in a nominative fair-use context where applicable.",
              "Purchasing a product grants you a personal, non-commercial licence to use the physical item only.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-green-600 font-mono shrink-0 select-none">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 8 */}
        <section id="liability" className="scroll-mt-20">
          <Heading n={8} slug="limitation_of_liability" title="Limitation of Liability" />
          <p className="text-zinc-300 mb-3">
            To the maximum extent permitted by applicable law:
          </p>
          <ul className="space-y-2 text-zinc-400">
            {[
              "OnlyDevs is not liable for indirect, incidental, or consequential damages arising from the use of our products or services.",
              "Our total liability for any claim is limited to the value of the order giving rise to the claim.",
              "We are not responsible for delays or failures caused by Printful, Stripe, shipping carriers, or events outside our control.",
              "Product descriptions and images are provided in good faith; minor variations from physical products do not constitute a defect.",
            ].map((item) => (
              <li key={item} className="flex gap-2">
                <span className="text-green-600 font-mono shrink-0 select-none">→</span>
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* 9 */}
        <section id="governing-law" className="scroll-mt-20">
          <Heading n={9} slug="governing_law" title="Governing Law & Disputes" />
          <p className="text-zinc-300 mb-3">
            These Terms of Service are governed by the laws of{" "}
            <strong className="text-zinc-200">Switzerland</strong>, without regard to conflict-of-law
            provisions. EU consumer protection law applies where mandatory for EU residents.
          </p>
          <p className="text-zinc-400">
            Any dispute arising from these terms or the use of OnlyDevs shall first be addressed
            through good-faith negotiation by emailing us. If not resolved within 30 days, disputes
            shall be submitted to the competent courts of Switzerland.
          </p>
          <p className="text-zinc-400 mt-3">
            EU residents may also use the{" "}
            <ExternalLink href="https://ec.europa.eu/consumers/odr">
              EU Online Dispute Resolution platform
            </ExternalLink>.
          </p>
        </section>

        {/* 10 */}
        <section id="contact" className="scroll-mt-20">
          <Heading n={10} slug="contact" title="Contact" />
          <p className="text-zinc-300 mb-4">
            For any questions about these terms, orders, or refunds:
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
              <span className="text-zinc-300">Switzerland — Swiss Code of Obligations (OR)</span>
            </p>
          </div>
        </section>

      </div>

      {/* Footer nav */}
      <div className="mt-16 pt-8 border-t border-zinc-800 flex items-center justify-between font-mono text-xs text-zinc-600">
        <a href="#" className="hover:text-green-400 transition-colors">↑ back to top</a>
        <Link href="/privacy" className="hover:text-green-400 transition-colors">
          ← Privacy Policy
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

function PolicyBlock({
  status,
  title,
  desc,
}: {
  status: "accepted" | "rejected";
  title: string;
  desc: string;
}) {
  return (
    <div
      className={`border rounded-lg p-4 ${
        status === "accepted"
          ? "border-green-900/60 bg-green-950/20"
          : "border-red-900/60 bg-red-950/20"
      }`}
    >
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`font-mono text-xs font-bold ${
            status === "accepted" ? "text-green-500" : "text-red-500"
          }`}
        >
          {status === "accepted" ? "✓ accepted" : "✗ not accepted"}
        </span>
        <span className="font-semibold text-zinc-200 text-sm">{title}</span>
      </div>
      <p className="text-zinc-400 text-xs leading-relaxed">{desc}</p>
    </div>
  );
}
