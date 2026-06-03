import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["en", "de", "fr", "it", "pt"] as const,
  defaultLocale: "en",
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];

/** Maps locale to default currency */
export const LOCALE_CURRENCY: Record<Locale, "CHF" | "EUR"> = {
  en: "EUR",
  de: "EUR",
  fr: "EUR",
  it: "EUR",
  pt: "EUR",
};

/** Locales that default to CHF (Swiss German, Swiss French, Swiss Italian) */
export const CH_LOCALES = ["de-CH", "fr-CH", "it-CH"] as const;
