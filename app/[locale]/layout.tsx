import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SessionProvider } from "next-auth/react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { routing } from "@/lib/i18n/routing";
import { parseCurrencyCookie, getDefaultCurrency, CURRENCY_COOKIE } from "@/lib/currency";
import NavbarWrapper from "@/components/NavbarWrapper";
import FooterWrapper from "@/components/FooterWrapper";
import CookieBanner from "@/components/CookieBanner";
import type { Locale } from "@/lib/i18n/routing";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const BASE = "https://www.onlydevs.shop";

const OG_LOCALE: Record<string, string> = {
  en: "en_US", de: "de_DE", fr: "fr_FR", it: "it_IT", pt: "pt_PT",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  return {
    metadataBase: new URL(BASE),
    title: {
      default: "OnlyDevs — Merch for Developers",
      template: "%s | OnlyDevs",
    },
    description:
      "Premium apparel and accessories for developers, DevOps engineers and infrastructure nerds. Shipping across Switzerland and Europe.",
    keywords: [
      "developer merch",
      "programmer t-shirts",
      "devops apparel",
      "tech accessories",
      "coding hoodies",
      "developer gifts",
      "programmer hoodie",
      "Switzerland tech merch",
    ],
    authors: [{ name: "OnlyDevs" }],
    robots: { index: true, follow: true },
    alternates: {
      canonical: `${BASE}/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [l, `${BASE}/${l}`])
      ),
    },
    openGraph: {
      siteName: "OnlyDevs",
      type: "website",
      url: `${BASE}/${locale}`,
      locale: OG_LOCALE[locale] ?? "en_US",
      images: [
        {
          url: "/onlydevs_logo.png",
          width: 200,
          height: 56,
          alt: "OnlyDevs",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@onlydevs_shop",
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  const [messages, session, cookieStore] = await Promise.all([
    getMessages(),
    auth(),
    cookies(),
  ]);

  const currency =
    parseCurrencyCookie(cookieStore.get(CURRENCY_COOKIE)?.value) ??
    getDefaultCurrency(locale as Locale);

  return (
    <html
      lang={locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SessionProvider>
          <NextIntlClientProvider messages={messages}>
            <NavbarWrapper
              currency={currency}
              isAuthenticated={!!session?.user?.id}
              isAdmin={session?.user?.role === "ADMIN"}
              locale={locale}
            />
            {children}
            <FooterWrapper />
            <CookieBanner />
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
