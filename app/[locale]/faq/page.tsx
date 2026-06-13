// TODO: i18n — content is English-only; translate per locale when copy review is complete
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to frequently asked questions about orders, shipping and OnlyDevs products.",
};

interface FaqItem {
  q: string;
  a: string;
}

interface FaqCategory {
  label: string;
  slug: string;
  items: FaqItem[];
}

const CATEGORIES: FaqCategory[] = [
  {
    label: "Shipping",
    slug: "shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Orders are fulfilled by Printful and typically delivered within 5–10 business days across Europe. Switzerland orders may take 3–7 business days.",
      },
      {
        q: "Do you ship outside Europe?",
        a: "Currently we focus on Switzerland and the EU. International shipping may be available on request — contact us at onlydevs.shop@gmail.com",
      },
      {
        q: "How much does shipping cost?",
        a: "Shipping costs are calculated at checkout based on your location and order size.",
      },
    ],
  },
  {
    label: "Products",
    slug: "products",
    items: [
      {
        q: "What is print-on-demand?",
        a: "Every product is made when you order it. Nothing is kept in stock — your item is printed and shipped directly from Printful's EU fulfillment center.",
      },
      {
        q: "How do I know which size to order?",
        a: "Each product page includes a size guide. When in doubt, size up — our products run true to size.",
      },
      {
        q: "Are the products good quality?",
        a: "We use Printful's premium blanks — Bella+Canvas for t-shirts, industry-leading suppliers for hoodies and accessories. All products are reviewed before being listed.",
      },
    ],
  },
  {
    label: "Orders & Returns",
    slug: "orders",
    items: [
      {
        q: "Can I cancel or change my order?",
        a: "Because products are made on demand, we cannot cancel or change orders once they are placed. Please review your order carefully before checkout.",
      },
      {
        q: "What if my item arrives damaged or with a print error?",
        a: "Contact us within 14 days of delivery at onlydevs.shop@gmail.com with a photo of the issue. We will send a replacement or issue a full refund.",
      },
      {
        q: "Do you accept returns?",
        a: "We do not accept returns for change of mind — this is standard for print-on-demand products. However, defective or incorrect items are always replaced at no cost.",
      },
    ],
  },
  {
    label: "Payments",
    slug: "payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Visa, Mastercard, TWINT (Switzerland), SEPA, Apple Pay and Google Pay via Stripe. All payments are secure and PCI compliant.",
      },
      {
        q: "What currencies do you accept?",
        a: "CHF for Swiss customers and EUR for European customers. Currency is auto-detected based on your location and can be changed in the store.",
      },
    ],
  },
  {
    label: "Account",
    slug: "account",
    items: [
      {
        q: "Do I need an account to order?",
        a: "Yes, an account is required to track your orders and manage your data. Registration takes under a minute via email or Google.",
      },
      {
        q: "How do I delete my account?",
        a: "Go to Account → Profile → Delete my account. All personal data is permanently deleted in compliance with GDPR and Swiss nLPD.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">

      {/* Header */}
      <div className="mb-12">
        <p className="font-mono text-green-500 text-xs mb-3">// faq</p>
        <h1 className="text-3xl font-bold mb-3">Frequently Asked Questions</h1>
        <p className="font-mono text-xs text-zinc-500">
          Can&apos;t find your answer?{" "}
          <a
            href="mailto:onlydevs.shop@gmail.com"
            className="text-green-400 hover:underline"
          >
            Contact us →
          </a>
        </p>
      </div>

      {/* Categories */}
      <div className="space-y-12">
        {CATEGORIES.map((cat) => (
          <section key={cat.slug} id={cat.slug}>
            <p className="font-mono text-xs text-zinc-500 mb-4">
              // {cat.slug}
            </p>
            <h2 className="text-lg font-bold mb-4">{cat.label}</h2>
            <div className="space-y-1">
              {cat.items.map((item, i) => (
                <details
                  key={i}
                  className="group border border-zinc-800 rounded-lg bg-zinc-950 open:bg-zinc-900 transition-colors"
                >
                  <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none select-none">
                    <span className="font-mono text-sm text-zinc-200 group-open:text-green-400 transition-colors">
                      {item.q}
                    </span>
                    <span className="font-mono text-green-600 text-xs shrink-0 group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <div className="px-5 pb-5 pt-1">
                    <p className="text-sm text-zinc-400 leading-relaxed font-mono">
                      {item.a}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Footer CTA */}
      <div className="mt-14 p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
        <p className="font-mono text-xs text-zinc-500 mb-2">// still.need.help</p>
        <p className="text-sm text-zinc-300 mb-4">
          Our team reads every message. We typically respond within 1 business day.
        </p>
        <a
          href="mailto:onlydevs.shop@gmail.com"
          className="inline-block font-mono text-sm font-bold text-black bg-green-500 hover:bg-green-400 transition-colors px-5 py-2.5 rounded-md"
        >
          onlydevs.shop@gmail.com →
        </a>
      </div>
    </main>
  );
}
