import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

const isDev = process.env.NODE_ENV === "development";

const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' https://js.stripe.com${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' blob: data: https://*.cdn.printful.com https://placehold.co",
      "font-src 'self'",
      "frame-src https://js.stripe.com",
      "connect-src 'self' https://api.stripe.com",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  // Prevent Prisma + pg from being bundled for the browser
  serverExternalPackages: ["@prisma/adapter-pg", "pg", "pg-native"],
  redirects: async () => [
    {
      source: "/:path*",
      has: [{ type: "host", value: "onlydevs.shop" }],
      destination: "https://www.onlydevs.shop/:path*",
      permanent: true,
    },
  ],
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.cdn.printful.com",
      },
      {
        protocol: "https",
        hostname: "placehold.co",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
