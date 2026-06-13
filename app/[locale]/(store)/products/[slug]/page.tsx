import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { getCachedProduct } from "@/lib/products";
import { getProductIdFromSlug } from "@/lib/printful";
import { getDefaultCurrency, parseCurrencyCookie, CURRENCY_COOKIE } from "@/lib/currency";
import VariantSelector from "@/components/VariantSelector";
import CurrencyToggle from "@/components/CurrencyToggle";
import { routing, type Locale } from "@/lib/i18n/routing";

// cookies() requires request-time access — disable static generation.
// TODO: restore ISR by extracting currency into a Suspense child component.
export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ locale: Locale; slug: string }>;
}

const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  de: "de_DE",
  fr: "fr_FR",
  it: "it_IT",
  pt: "pt_PT",
};

export async function generateMetadata({ params }: Props) {
  const { locale, slug } = await params;
  const id = getProductIdFromSlug(slug);
  if (!id) return {};

  try {
    const detail = await getCachedProduct(id);
    if (!detail) return {};
    const { sync_product } = detail;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://www.onlydevs.shop";
    const canonical = `${appUrl}/${locale}/products/${slug}`;

    const rawDesc = `Buy ${sync_product.name} at OnlyDevs — premium developer merch shipped across Switzerland and Europe.`;
    const description = rawDesc.length > 160 ? rawDesc.slice(0, 157) + "…" : rawDesc;

    const images = sync_product.thumbnail_url
      ? [{ url: sync_product.thumbnail_url, width: 800, height: 800, alt: sync_product.name }]
      : [];

    return {
      title: sync_product.name,
      description,
      alternates: {
        canonical,
        languages: Object.fromEntries(
          routing.locales.map((l) => [l, `${appUrl}/${l}/products/${slug}`])
        ),
      },
      openGraph: {
        title: `${sync_product.name} | OnlyDevs`,
        description,
        url: canonical,
        siteName: "OnlyDevs",
        type: "website",
        locale: OG_LOCALE[locale] ?? "en_US",
        images,
      },
      twitter: {
        card: "summary_large_image",
        title: `${sync_product.name} | OnlyDevs`,
        description,
        images: images.map((img) => img.url),
      },
    };
  } catch {
    return {};
  }
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: "products" });

  const id = getProductIdFromSlug(slug);
  if (!id) notFound();

  let detail;
  try {
    detail = await getCachedProduct(id);
  } catch {
    notFound();
  }

  if (!detail) notFound();

  const { sync_product, sync_variants } = detail;

  const cookieStore = await cookies();
  const currencyCookie = cookieStore.get(CURRENCY_COOKIE)?.value;
  const currency = parseCurrencyCookie(currencyCookie) ?? getDefaultCurrency(locale);

  // Primary image: first preview file, fallback to thumbnail
  const primaryImage =
    sync_variants[0]?.files.find((f) => f.type === "preview")?.preview_url ??
    sync_product.thumbnail_url;

  const lowestVariantPrice = sync_variants[0]?.retail_price;
  const variantCurrency = sync_variants[0]?.currency ?? "CHF";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: sync_product.name,
    image: primaryImage ?? undefined,
    description: `Developer merch from OnlyDevs — ${sync_product.name}. Ships across Switzerland and Europe.`,
    brand: { "@type": "Brand", name: "OnlyDevs" },
    ...(lowestVariantPrice && {
      offers: {
        "@type": "Offer",
        price: lowestVariantPrice,
        priceCurrency: variantCurrency,
        availability: "https://schema.org/InStock",
        seller: { "@type": "Organization", name: "OnlyDevs" },
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <main className="max-w-5xl mx-auto px-6 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product image */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
          {primaryImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={primaryImage}
              alt={sync_product.name}
              className="w-full aspect-square object-cover"
            />
          ) : (
            <div className="w-full aspect-square flex items-center justify-center">
              <span className="font-mono text-zinc-600 text-xs">no image</span>
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="font-mono text-xs text-green-500 uppercase tracking-widest mb-2">
              {t(sync_product.category === "all" ? "merch" : sync_product.category)}
            </p>
            <h1 className="text-2xl font-bold leading-snug">{sync_product.name}</h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-500">{t("currency")}:</span>
            <CurrencyToggle current={currency} />
          </div>

          <VariantSelector
            productId={String(sync_product.id)}
            productName={sync_product.name}
            variants={sync_variants}
            currency={currency}
          />

          <p className="text-xs text-zinc-500 leading-relaxed">
            Printed on demand via Printful. Ships within 3–7 business days across
            Europe and Switzerland.
          </p>
        </div>
      </div>
    </main>
    </>
  );
}
