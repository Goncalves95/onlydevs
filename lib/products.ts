import { unstable_cache } from "next/cache";
import { getProducts, getProductById } from "@/lib/printful";

export const getCachedProducts = unstable_cache(
  async () => {
    try {
      return await getProducts();
    } catch {
      return [];
    }
  },
  ["printful-products"],
  { revalidate: 3600, tags: ["products"] }
);

export const getCachedProduct = unstable_cache(
  async (id: number) => {
    return getProductById(id);
  },
  ["printful-product"],
  { revalidate: 3600, tags: ["products"] }
);
