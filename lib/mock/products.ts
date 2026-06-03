import type { PrintfulProduct, PrintfulProductDetail, PrintfulVariant } from "@/lib/printful";

const THUMBS: Record<number, string> = {
  1001: "https://placehold.co/400x400/111111/00ff88?text=Classic+Tee",
  1002: "https://placehold.co/400x400/111111/00ff88?text=Hoodie",
  1003: "https://placehold.co/400x400/111111/00ff88?text=Sweatshirt",
  1004: "https://placehold.co/400x400/111111/00ff88?text=Long+Sleeve",
  1005: "https://placehold.co/400x400/111111/00ff88?text=Laptop+Bag",
  1006: "https://placehold.co/400x400/111111/00ff88?text=Coffee+Mug",
  1007: "https://placehold.co/400x400/111111/00ff88?text=Phone+Case",
  1008: "https://placehold.co/400x400/111111/00ff88?text=Water+Bottle",
  1009: "https://placehold.co/400x400/111111/00ff88?text=Sticker+Pack",
  1010: "https://placehold.co/400x400/111111/00ff88?text=Terminal",
  1011: "https://placehold.co/400x400/111111/00ff88?text=Git+Push",
  1012: "https://placehold.co/400x400/111111/00ff88?text=Debug+Mode",
};

export const mockProducts: PrintfulProduct[] = [
  // Merch
  { id: 1001, external_id: "mock-1001", name: "OnlyDevs Classic Tee",    slug: "onlydevs-classic-tee-1001",    variants: 4, synced: 4, thumbnail_url: THUMBS[1001], is_ignored: false, category: "merch",    lowestPriceCents: { chf: 3200, eur: 2900 } },
  { id: 1002, external_id: "mock-1002", name: "OnlyDevs Hoodie",          slug: "onlydevs-hoodie-1002",          variants: 4, synced: 4, thumbnail_url: THUMBS[1002], is_ignored: false, category: "merch",    lowestPriceCents: { chf: 5200, eur: 4900 } },
  { id: 1003, external_id: "mock-1003", name: "OnlyDevs Sweatshirt",      slug: "onlydevs-sweatshirt-1003",      variants: 4, synced: 4, thumbnail_url: THUMBS[1003], is_ignored: false, category: "merch",    lowestPriceCents: { chf: 4500, eur: 4200 } },
  { id: 1004, external_id: "mock-1004", name: "OnlyDevs Long Sleeve",     slug: "onlydevs-long-sleeve-1004",     variants: 4, synced: 4, thumbnail_url: THUMBS[1004], is_ignored: false, category: "merch",    lowestPriceCents: { chf: 3500, eur: 3200 } },
  // Tech
  { id: 1005, external_id: "mock-1005", name: "OnlyDevs Laptop Bag",      slug: "onlydevs-laptop-bag-1005",      variants: 1, synced: 1, thumbnail_url: THUMBS[1005], is_ignored: false, category: "tech",     lowestPriceCents: { chf: 6900, eur: 6500 } },
  // Merch (lifestyle accessories)
  { id: 1006, external_id: "mock-1006", name: "OnlyDevs Coffee Mug",      slug: "onlydevs-coffee-mug-1006",      variants: 1, synced: 1, thumbnail_url: THUMBS[1006], is_ignored: false, category: "merch",    lowestPriceCents: { chf: 2200, eur: 1900 } },
  { id: 1007, external_id: "mock-1007", name: "OnlyDevs Phone Case",      slug: "onlydevs-phone-case-1007",      variants: 1, synced: 1, thumbnail_url: THUMBS[1007], is_ignored: false, category: "merch",    lowestPriceCents: { chf: 2900, eur: 2700 } },
  { id: 1008, external_id: "mock-1008", name: "OnlyDevs Water Bottle",    slug: "onlydevs-water-bottle-1008",    variants: 1, synced: 1, thumbnail_url: THUMBS[1008], is_ignored: false, category: "merch",    lowestPriceCents: { chf: 3200, eur: 2900 } },
  // Stickers
  { id: 1009, external_id: "mock-1009", name: "OnlyDevs Logo Sticker Pack",  slug: "onlydevs-logo-sticker-pack-1009",  variants: 1, synced: 1, thumbnail_url: THUMBS[1009], is_ignored: false, category: "stickers", lowestPriceCents: { chf: 1600, eur: 1400 } },
  { id: 1010, external_id: "mock-1010", name: "OnlyDevs Terminal Sticker",   slug: "onlydevs-terminal-sticker-1010",   variants: 1, synced: 1, thumbnail_url: THUMBS[1010], is_ignored: false, category: "stickers", lowestPriceCents: { chf:  800, eur:  700 } },
  { id: 1011, external_id: "mock-1011", name: "OnlyDevs Git Push Sticker",   slug: "onlydevs-git-push-sticker-1011",   variants: 1, synced: 1, thumbnail_url: THUMBS[1011], is_ignored: false, category: "stickers", lowestPriceCents: { chf:  800, eur:  700 } },
  { id: 1012, external_id: "mock-1012", name: "OnlyDevs Debug Mode Sticker", slug: "onlydevs-debug-mode-sticker-1012", variants: 1, synced: 1, thumbnail_url: THUMBS[1012], is_ignored: false, category: "stickers", lowestPriceCents: { chf:  800, eur:  700 } },
];

// CHF prices per product (used in variant retail_price)
const CHF_PRICES: Record<number, string> = {
  1001: "32.00", 1002: "52.00", 1003: "45.00", 1004: "35.00",
  1005: "69.00", 1006: "22.00", 1007: "29.00", 1008: "32.00",
  1009: "16.00", 1010: "8.00",  1011: "8.00",  1012: "8.00",
};

const MERCH_SIZES = ["S", "M", "L", "XL"];

function buildVariants(product: PrintfulProduct): PrintfulVariant[] {
  const price = CHF_PRICES[product.id] ?? "29.00";
  const thumb = product.thumbnail_url;

  const sizes = product.category === "merch" ? MERCH_SIZES : ["One Size"];

  return sizes.map((size, i) => ({
    id: product.id * 10 + i,
    external_id: `mock-variant-${product.id}-${i}`,
    name: size,
    synced: true,
    variant_id: product.id * 10 + i,
    retail_price: price,
    currency: "CHF",
    product: { variant_id: product.id * 10 + i, product_id: product.id, image: thumb, name: size },
    files: [],
    options: [],
  }));
}

export function getMockProductDetail(id: number): PrintfulProductDetail | null {
  const product = mockProducts.find((p) => p.id === id);
  if (!product) return null;
  return { sync_product: product, sync_variants: buildVariants(product) };
}
