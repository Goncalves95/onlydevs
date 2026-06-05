import { unstable_cache } from "next/cache";
import { getProducts, getProductById } from "@/lib/printful";
import { mockProducts, getMockProductDetail } from "@/lib/mock/products";

// Only gate on the API key — NODE_ENV is intentionally excluded so that
// setting PRINTFUL_API_KEY in any environment (including local) enables real data.
function useMocks(): boolean {
  return !process.env.PRINTFUL_API_KEY;
}

export const getCachedProducts = unstable_cache(
  async () => {
    const mocks = useMocks();
    console.log("[products] PRINTFUL_API_KEY present:", !mocks);
    console.log("[products] NODE_ENV:", process.env.NODE_ENV);
    console.log("[products] useMocks:", mocks);
    if (mocks) return mockProducts;
    try {
      return await getProducts();
    } catch (err) {
      console.error("[products] getProducts failed, falling back to mocks:", err);
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
    } catch (err) {
      console.error("[products] getProductById failed, falling back to mock:", err);
      return getMockProductDetail(id);
    }
  },
  ["printful-product"],
  { revalidate: 3600, tags: ["products"] }
);
