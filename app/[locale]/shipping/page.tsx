// TODO: i18n — content is English-only; translate per locale when copy review is complete
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping & Returns",
  description: "Shipping information and return policy for OnlyDevs orders.",
};

export default function ShippingPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">

      {/* Header */}
      <div className="mb-12">
        <p className="font-mono text-green-500 text-xs mb-3">// shipping.and.returns</p>
        <h1 className="text-3xl font-bold mb-3">Shipping &amp; Returns</h1>
        <p className="font-mono text-xs text-zinc-500">
          Last updated: June 2025
        </p>
      </div>

      <div className="space-y-10">

        {/* Section 1 — Shipping */}
        <section id="shipping">
          <p className="font-mono text-xs text-zinc-500 mb-3">// 01. shipping</p>
          <h2 className="text-xl font-bold mb-5">Shipping</h2>

          <div className="space-y-5 text-sm text-zinc-400 leading-relaxed">
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-lg">
              <h3 className="font-semibold text-zinc-200 mb-2">Fulfillment</h3>
              <p>
                All orders are fulfilled by{" "}
                <span className="text-green-400 font-mono">Printful</span> from their
                EU fulfillment centers. Products are printed on demand — your item is
                produced and dispatched directly to you.
              </p>
            </div>

            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-lg">
              <h3 className="font-semibold text-zinc-200 mb-2">Delivery Times</h3>
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-zinc-500">Switzerland</span>
                  <span className="text-zinc-300">3–7 business days</span>
                </div>
                <div className="h-px bg-zinc-800" />
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-zinc-500">European Union</span>
                  <span className="text-zinc-300">5–10 business days</span>
                </div>
                <div className="h-px bg-zinc-800" />
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-zinc-500">International</span>
                  <span className="text-zinc-300">On request</span>
                </div>
              </div>
              <p className="mt-4 text-xs text-zinc-600">
                Times are estimates from dispatch date and do not include production time
                (typically 2–5 business days).
              </p>
            </div>

            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-lg">
              <h3 className="font-semibold text-zinc-200 mb-2">Shipping Costs</h3>
              <p>
                Shipping costs are calculated at checkout based on your delivery
                address and order size. You will see the exact cost before confirming
                payment.
              </p>
            </div>

            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-lg">
              <h3 className="font-semibold text-zinc-200 mb-2">Tracking</h3>
              <p>
                Once your order ships, you will receive a shipping confirmation email
                with a tracking number. You can also track your order from{" "}
                <span className="font-mono text-green-400">Account → Orders</span>.
              </p>
            </div>
          </div>
        </section>

        <div className="h-px bg-zinc-800" />

        {/* Section 2 — Returns */}
        <section id="returns">
          <p className="font-mono text-xs text-zinc-500 mb-3">// 02. returns</p>
          <h2 className="text-xl font-bold mb-5">Returns Policy</h2>

          <div className="space-y-5 text-sm text-zinc-400 leading-relaxed">
            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-lg border-l-2 border-l-zinc-600">
              <h3 className="font-semibold text-zinc-200 mb-2">No Returns for Change of Mind</h3>
              <p>
                Because every item is made on demand specifically for you, we are
                unable to accept returns or exchanges for change of mind. This is
                standard practice for print-on-demand products.
              </p>
            </div>

            <div className="p-5 bg-zinc-900 border border-zinc-800 rounded-lg border-l-2 border-l-green-700">
              <h3 className="font-semibold text-zinc-200 mb-2">Defective or Incorrect Items — Always Replaced</h3>
              <p>
                If your item arrives damaged, with a print error, or is the wrong item,
                we will send you a free replacement or issue a full refund. No return
                shipment required.
              </p>
              <ul className="mt-3 space-y-1 font-mono text-xs text-zinc-500">
                <li className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  Contact us within <span className="text-zinc-300 mx-1">14 days</span> of delivery
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  Include a photo of the defect
                </li>
                <li className="flex gap-2">
                  <span className="text-green-500">✓</span>
                  Replacement or full refund — your choice
                </li>
              </ul>
            </div>
          </div>
        </section>

        <div className="h-px bg-zinc-800" />

        {/* Section 3 — Contact */}
        <section id="contact">
          <p className="font-mono text-xs text-zinc-500 mb-3">// 03. contact</p>
          <h2 className="text-xl font-bold mb-5">Questions &amp; Issues</h2>
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
            <p className="text-sm text-zinc-400 mb-5 leading-relaxed">
              For any order issues, shipping questions, or claims, contact us directly.
              We respond within 1 business day.
            </p>
            <a
              href="mailto:onlydevs.shop@gmail.com"
              className="inline-block font-mono text-sm font-bold text-black bg-green-500 hover:bg-green-400 transition-colors px-5 py-2.5 rounded-md"
            >
              onlydevs.shop@gmail.com →
            </a>
          </div>
        </section>
      </div>
    </main>
  );
}
