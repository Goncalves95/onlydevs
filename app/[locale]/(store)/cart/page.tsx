import { getTranslations } from "next-intl/server";
import { cookies } from "next/headers";
import { getDefaultCurrency, parseCurrencyCookie, CURRENCY_COOKIE } from "@/lib/currency";
import CartClient from "@/components/CartClient";
import type { Locale } from "@/lib/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cart" });
  return { title: t("title") };
}

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cart" });

  const cookieStore = await cookies();
  const currency =
    parseCurrencyCookie(cookieStore.get(CURRENCY_COOKIE)?.value) ??
    getDefaultCurrency(locale);

  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-10">{t("title")}</h1>
      <CartClient currency={currency} locale={locale} />
    </main>
  );
}
