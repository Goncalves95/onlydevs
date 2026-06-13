import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/", "/account", "/cart", "/checkout"],
    },
    sitemap: "https://www.onlydevs.shop/sitemap.xml",
    host: "https://www.onlydevs.shop",
  };
}
