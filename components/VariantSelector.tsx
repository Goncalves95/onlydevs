"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import type { PrintfulVariant } from "@/lib/printful";
import type { Currency } from "@/lib/currency";
import { formatPrice } from "@/lib/currency";
import AddToCartButton from "./AddToCartButton";

interface Props {
  productId: string;
  productName: string;
  variants: PrintfulVariant[];
  currency: Currency;
}

export default function VariantSelector({ productId, productName, variants, currency }: Props) {
  const t = useTranslations("products");
  const [selectedId, setSelectedId] = useState<number | null>(
    variants.length === 1 ? variants[0].id : null
  );

  const selected = variants.find((v) => v.id === selectedId) ?? null;

  // Extract unique size labels from variant names (e.g. "Blue / L" → "L")
  const sizes = Array.from(
    new Map(
      variants.map((v) => {
        const parts = v.name.split(" / ");
        const size = parts[parts.length - 1].trim();
        return [size, v];
      })
    ).entries()
  );

  return (
    <div className="space-y-4">
      {sizes.length > 1 && (
        <div>
          <p className="text-xs text-zinc-400 mb-2 uppercase tracking-wide">{t("selectSize")}</p>
          <div className="flex flex-wrap gap-2">
            {sizes.map(([size, variant]) => (
              <button
                key={size}
                onClick={() => setSelectedId(variant.id)}
                className={`px-3 py-1.5 text-sm rounded border transition-colors ${
                  selectedId === variant.id
                    ? "border-green-500 bg-green-500/10 text-green-400"
                    : "border-zinc-700 text-zinc-300 hover:border-zinc-500"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {selected && (
        <p className="text-xl font-bold text-green-400 font-mono">
          {formatPrice(Math.round(parseFloat(selected.retail_price) * 100), currency)}
        </p>
      )}

      <AddToCartButton
        productId={productId}
        productName={productName}
        variant={selected}
        currency={currency}
      />
    </div>
  );
}
