import { cookies } from "next/headers";
import { getCachedProducts } from "@/lib/products";
import { parseCurrencyCookie, getDefaultCurrency, CURRENCY_COOKIE } from "@/lib/currency";
import type { Locale } from "@/lib/i18n/routing";
import HomePage from "@/components/HomePage";

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const [cookieStore, products] = await Promise.all([
    cookies(),
    getCachedProducts(),
  ]);
  const currency =
    parseCurrencyCookie(cookieStore.get(CURRENCY_COOKIE)?.value) ??
    getDefaultCurrency(locale as Locale);

  return <HomePage featured={products.slice(0, 3)} currency={currency} />;
}
