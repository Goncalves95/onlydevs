import type { MetadataRoute } from "next";
import { routing } from "@/lib/i18n/routing";
import { getCachedProducts } from "@/lib/products";

const BASE = "https://www.onlydevs.shop";

function localeUrls(buildPath: (locale: string) => string): Record<string, string> {
  return Object.fromEntries(routing.locales.map((l) => [l, `${BASE}${buildPath(l)}`]));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getCachedProducts();
  const now = new Date();

  const staticEntries = routing.locales.flatMap((locale) => [
    {
      url: `${BASE}/${locale}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1.0,
      alternates: { languages: localeUrls((l) => `/${l}`) },
    },
    {
      url: `${BASE}/${locale}/products`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 0.9,
      alternates: { languages: localeUrls((l) => `/${l}/products`) },
    },
    {
      url: `${BASE}/${locale}/about`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.3,
      alternates: { languages: localeUrls((l) => `/${l}/about`) },
    },
    {
      url: `${BASE}/${locale}/privacy`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.3,
      alternates: { languages: localeUrls((l) => `/${l}/privacy`) },
    },
    {
      url: `${BASE}/${locale}/terms`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.3,
      alternates: { languages: localeUrls((l) => `/${l}/terms`) },
    },
    {
      url: `${BASE}/${locale}/cookies`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.3,
      alternates: { languages: localeUrls((l) => `/${l}/cookies`) },
    },
  ]);

  const productEntries = products.flatMap((product) =>
    routing.locales.map((locale) => ({
      url: `${BASE}/${locale}/products/${product.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: localeUrls((l) => `/${l}/products/${product.slug}`),
      },
    }))
  );

  return [...staticEntries, ...productEntries];
}
