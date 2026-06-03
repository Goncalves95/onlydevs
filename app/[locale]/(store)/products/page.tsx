import { Suspense } from "react";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/lib/i18n/navigation";
import { getCachedProducts } from "@/lib/products";
import { formatPrice } from "@/lib/currency";
import { getDefaultCurrency, parseCurrencyCookie, CURRENCY_COOKIE } from "@/lib/currency";
import { ProductGridSkeleton } from "@/components/ProductCardSkeleton";
import { cookies } from "next/headers";
import type { ProductCategory, PrintfulProduct } from "@/lib/printful";
import type { Locale } from "@/lib/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return { title: t("title") };
}

const CATEGORIES: ProductCategory[] = ["merch", "tech", "stickers"];

async function ProductGrid({
  category,
  locale,
}: {
  category: ProductCategory | "all";
  locale: Locale;
}) {
  const [cookieStore, t] = await Promise.all([
    cookies(),
    getTranslations({ locale, namespace: "products" }),
  ]);
  const currencyCookie = cookieStore.get(CURRENCY_COOKIE)?.value;
  const currency =
    parseCurrencyCookie(currencyCookie) ?? getDefaultCurrency(locale);

  const allProducts = await getCachedProducts();
  const products =
    category === "all"
      ? allProducts
      : allProducts.filter((p: PrintfulProduct) => p.category === category);

  if (products.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((p: PrintfulProduct) => (
        <Link
          key={p.id}
          href={`/products/${p.slug}`}
          className="bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden hover:border-green-500 transition-colors group"
        >
          {p.thumbnail_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.thumbnail_url}
              alt={p.name}
              className="w-full aspect-square object-cover"
            />
          ) : (
            <div className="w-full aspect-square bg-zinc-800 flex items-center justify-center">
              <span className="font-mono text-zinc-600 text-xs">no image</span>
            </div>
          )}
          <div className="p-4">
            <h2 className="font-semibold text-sm group-hover:text-green-400 transition-colors line-clamp-2">
              {p.name}
            </h2>
            {p.lowestPriceCents && (
              <p className="text-xs text-zinc-400 mt-1 font-mono">
                {t("from")} {formatPrice(currency === "CHF" ? p.lowestPriceCents.chf : p.lowestPriceCents.eur, currency)}
              </p>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}

function EmptyState() {
  const t = useTranslations("products");
  return (
    <p className="text-zinc-500 font-mono text-sm col-span-full">
      // {t("comingSoon")}
    </p>
  );
}

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const { category: rawCategory } = await searchParams;
  const t = await getTranslations({ locale, namespace: "products" });

  const category: ProductCategory | "all" =
    CATEGORIES.includes(rawCategory as ProductCategory)
      ? (rawCategory as ProductCategory)
      : "all";

  const categoryLabels: Record<ProductCategory | "all", string> = {
    all: t("all"),
    merch: t("merch"),
    tech: t("tech"),
    stickers: t("stickers"),
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8">{t("title")}</h1>

      {/* Category filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {(["all", ...CATEGORIES] as const).map((cat) => (
          <Link
            key={cat}
            href={cat === "all" ? "/products" : `/products?category=${cat}`}
            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              category === cat
                ? "bg-green-500 border-green-500 text-black"
                : "border-zinc-700 text-zinc-400 hover:border-green-500 hover:text-green-400"
            }`}
          >
            {categoryLabels[cat]}
          </Link>
        ))}
      </div>

      <Suspense fallback={<ProductGridSkeleton />}>
        <ProductGrid category={category} locale={locale} />
      </Suspense>
    </main>
  );
}
