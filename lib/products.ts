import { unstable_cache } from "next/cache";
import { getProducts, getProductById } from "@/lib/printful";
import { mockProducts, getMockProductDetail } from "@/lib/mock/products";

function useMocks(): boolean {
  return !process.env.PRINTFUL_API_KEY || process.env.NODE_ENV === "development";
}

export const getCachedProducts = unstable_cache(
  async () => {
    if (useMocks()) return mockProducts;
    try {
      return await getProducts();
    } catch {
      return mockProducts;
    }
  },
  ["printful-products"],
  { revalidate: 3600, tags: ["products"] }
);

export const getCachedProduct = unstable_cache(
  async (id: number) => {
    if (useMocks()) return getMockProductDetail(id);
    try {
      return await getProductById(id);
    } catch {
      return getMockProductDetail(id);
    }
  },
  ["printful-product"],
  { revalidate: 3600, tags: ["products"] }
);
