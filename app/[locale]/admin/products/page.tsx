import { mockProducts } from "@/lib/mock/products";
import { getProducts } from "@/lib/printful";
import type { PrintfulProduct } from "@/lib/printful";
import AdminRevalidateButton from "@/components/AdminRevalidateButton";

export const metadata = { title: "Admin — Products" };

export default async function AdminProductsPage() {
  const hasPrintful = !!process.env.PRINTFUL_API_KEY;
  const isDev = !hasPrintful;

  let products: PrintfulProduct[];
  if (hasPrintful) {
    products = await getProducts().catch(() => mockProducts);
  } else {
    products = mockProducts;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <div className="flex items-center gap-3">
          <AdminRevalidateButton />
          <span className="text-zinc-500 text-sm">{products.length} products</span>
        </div>
      </div>

      {isDev && (
        <div className="flex items-center gap-3 bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-3 text-sm">
          <span className="text-amber-400 font-mono text-xs shrink-0">// dev mode</span>
          <p className="text-amber-300/80">
            Showing mock products. Connect Printful in production by setting{" "}
            <code className="font-mono text-amber-400 text-xs">PRINTFUL_API_KEY</code>.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl overflow-hidden transition-colors"
          >
            {/* Thumbnail */}
            <div className="aspect-square bg-zinc-950 overflow-hidden">
              {product.thumbnail_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={product.thumbnail_url}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-zinc-700 font-mono text-xs">no image</span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="p-4 space-y-2">
              <p className="font-medium text-sm leading-snug">{product.name}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-500 capitalize">{product.category}</span>
                <span className="text-xs text-zinc-600 font-mono">
                  {product.variants} variant{product.variants !== 1 ? "s" : ""}
                </span>
              </div>
              {product.lowestPriceCents && (
                <p className="text-xs text-zinc-400 font-mono">
                  from CHF {(product.lowestPriceCents.chf / 100).toFixed(2)}
                </p>
              )}
              {hasPrintful && (
                <a
                  href={`https://www.printful.com/dashboard/products`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block text-xs text-purple-400 hover:text-purple-300 transition-colors mt-1"
                >
                  Edit in Printful →
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
