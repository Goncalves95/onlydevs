import type { Locale } from "@/lib/i18n/routing";

export type Currency = "CHF" | "EUR";

// Swiss locales → CHF by default
const CH_LOCALES: Locale[] = ["de", "fr", "it"];

export function getDefaultCurrency(locale: Locale): Currency {
  // In real geo-detection you'd check the user's country cookie/IP.
  // Here we map Swiss languages to CHF and everything else to EUR.
  return CH_LOCALES.includes(locale) ? "CHF" : "EUR";
}

export const CURRENCY_COOKIE = "onlydevs-currency";

/** Read the user's currency override from the cookie value (server-side safe). */
export function parseCurrencyCookie(value: string | undefined): Currency | null {
  if (value === "CHF" || value === "EUR") return value;
  return null;
}

export function formatPrice(amount: number, currency: Currency): string {
  return new Intl.NumberFormat("de-CH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount / 100);
}
