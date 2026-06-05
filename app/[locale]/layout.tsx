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
import type { Locale } from "@/lib/i18n/routing";
import "../globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "OnlyDevs — Merch for Developers",
    template: "%s | OnlyDevs",
  },
  description:
    "Tech merch and accessories for developers and DevOps engineers. Ships across Switzerland and Europe.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  ),
};

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
          </NextIntlClientProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
