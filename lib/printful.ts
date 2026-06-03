import { slugify } from "@/lib/utils";

const PRINTFUL_API_URL = "https://api.printful.com";

async function printfulFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) throw new Error("PRINTFUL_API_KEY is not set");

  const res = await fetch(`${PRINTFUL_API_URL}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(`Printful API error ${res.status}: ${JSON.stringify(error)}`);
  }

  return res.json();
}

export type ProductCategory = "merch" | "tech" | "stickers" | "all";

export interface PrintfulProduct {
  id: number;
  external_id: string;
  name: string;
  slug: string;
  variants: number;
  synced: number;
  thumbnail_url: string;
  is_ignored: boolean;
  category: ProductCategory;
}

export interface PrintfulVariant {
  id: number;
  external_id: string;
  name: string;
  synced: boolean;
  variant_id: number;
  retail_price: string;
  currency: string;
  product: { variant_id: number; product_id: number; image: string; name: string };
  files: Array<{ type: string; id: number; url: string; preview_url: string }>;
  options: unknown[];
  size?: string;
  color?: string;
}

export interface PrintfulProductDetail {
  sync_product: PrintfulProduct;
  sync_variants: PrintfulVariant[];
}

function inferCategory(name: string): ProductCategory {
  const lower = name.toLowerCase();
  if (lower.includes("sticker")) return "stickers";
  if (lower.includes("mug") || lower.includes("bottle") || lower.includes("case") || lower.includes("bag")) return "tech";
  return "merch";
}

function normalizeProduct(raw: Omit<PrintfulProduct, "slug" | "category">): PrintfulProduct {
  return {
    ...raw,
    slug: `${slugify(raw.name)}-${raw.id}`,
    category: inferCategory(raw.name),
  };
}

export async function getProducts(): Promise<PrintfulProduct[]> {
  const data = await printfulFetch<{ result: Array<Omit<PrintfulProduct, "slug" | "category">> }>(
    "/store/products"
  );
  return data.result.map(normalizeProduct);
}

export async function getProductById(productId: number): Promise<PrintfulProductDetail> {
  const data = await printfulFetch<{ result: { sync_product: Omit<PrintfulProduct, "slug" | "category">; sync_variants: PrintfulVariant[] } }>(
    `/store/products/${productId}`
  );
  return {
    sync_product: normalizeProduct(data.result.sync_product),
    sync_variants: data.result.sync_variants,
  };
}

export function getProductIdFromSlug(slug: string): number | null {
  const parts = slug.split("-");
  const id = parseInt(parts[parts.length - 1], 10);
  return isNaN(id) ? null : id;
}

export async function createOrder(orderData: unknown): Promise<unknown> {
  return printfulFetch("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}
