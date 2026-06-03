"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/lib/store/cart";
import { formatPrice, type Currency } from "@/lib/currency";
import { Link } from "@/lib/i18n/navigation";

interface Props {
  currency: Currency;
  locale: string;
}

export default function CartClient({ currency, locale }: Props) {
  const t = useTranslations("cart");
  const { items, removeItem, updateQuantity, total } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, locale }),
      });

      if (res.status === 401) {
        window.location.href = `/${locale}/login?callbackUrl=/${locale}/cart`;
        return;
      }

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Checkout failed");
      }

      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      setError(err instanceof Error ? err.message : t("checkoutError"));
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="font-mono text-zinc-500 text-sm mb-2">// {t("empty")}</p>
        <Link
          href="/products"
          className="mt-6 text-sm text-green-400 hover:text-green-300 underline underline-offset-4"
        >
          {t("continueShopping")}
        </Link>
      </div>
    );
  }

  const subtotal = total();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Cart items */}
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div
            key={item.variantId}
            className="flex gap-4 bg-zinc-900 border border-zinc-800 rounded-lg p-4"
          >
            {/* Thumbnail */}
            <div className="w-20 h-20 flex-shrink-0 bg-zinc-800 rounded overflow-hidden">
              {item.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={item.imageUrl}
                  alt={item.productName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="font-mono text-zinc-600 text-xs">?</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm leading-snug truncate">
                {item.productName}
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">{item.variantName}</p>
              <p className="text-sm font-mono text-green-400 mt-1">
                {formatPrice(item.price, currency)}
              </p>
            </div>

            {/* Quantity controls + remove */}
            <div className="flex flex-col items-end justify-between gap-2">
              <button
                onClick={() => removeItem(item.variantId)}
                className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                aria-label={t("remove")}
              >
                {t("remove")}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                  className="w-7 h-7 rounded border border-zinc-700 hover:border-green-500 text-zinc-300 hover:text-green-400 transition-colors text-sm font-mono"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-5 text-center text-sm font-mono">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                  className="w-7 h-7 rounded border border-zinc-700 hover:border-green-500 text-zinc-300 hover:text-green-400 transition-colors text-sm font-mono"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Order summary sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 sticky top-6 space-y-4">
          <h2 className="font-semibold text-sm uppercase tracking-wider text-zinc-400">
            Summary
          </h2>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-400">{t("subtotal")}</span>
              <span className="font-mono">{formatPrice(subtotal, currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">{t("shipping")}</span>
              <span className="text-zinc-500 text-xs">{t("shippingCalc")}</span>
            </div>
            <p className="text-xs text-zinc-600">{t("vatNote")}</p>
          </div>

          <div className="border-t border-zinc-800 pt-4 flex justify-between font-semibold">
            <span>{t("total")}</span>
            <span className="font-mono text-green-400">
              {formatPrice(subtotal, currency)}
            </span>
          </div>

          {error && (
            <p className="text-xs text-red-400 font-mono">{error}</p>
          )}

          <button
            onClick={handleCheckout}
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-semibold py-3 rounded-md text-sm transition-colors"
          >
            {loading ? t("checkoutProcessing") : t("checkout")}
          </button>

          <Link
            href="/products"
            className="block text-center text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {t("continueShopping")}
          </Link>
        </div>
      </div>
    </div>
  );
}
