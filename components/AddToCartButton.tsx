"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useCartStore } from "@/lib/store/cart";
import type { PrintfulVariant } from "@/lib/printful";
import type { Currency } from "@/lib/currency";

interface Props {
  productId: string;
  productName: string;
  variant: PrintfulVariant | null;
  currency: Currency;
}

export default function AddToCartButton({ productId, productName, variant, currency }: Props) {
  const t = useTranslations("products");
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  if (!variant) {
    return (
      <button disabled className="w-full bg-zinc-800 text-zinc-500 font-semibold py-3 rounded-md text-sm cursor-not-allowed">
        {t("selectSize")}
      </button>
    );
  }

  function handleAdd() {
    if (!variant) return;
    const priceInCents = Math.round(parseFloat(variant.retail_price) * 100);
    addItem({
      variantId: String(variant.id),
      productId,
      productName,
      variantName: variant.name,
      price: priceInCents,
      currency,
      quantity: 1,
      imageUrl: variant.files.find((f) => f.type === "preview")?.preview_url,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <button
      onClick={handleAdd}
      className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-3 rounded-md text-sm transition-colors"
    >
      {added ? "✓ Added" : t("addToCart")}
    </button>
  );
}
