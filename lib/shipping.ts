import type { Currency } from "@/lib/currency";

/** Free shipping threshold in cents — 80.00 CHF or EUR */
export const FREE_SHIPPING_THRESHOLD = 8000;

/** Standard shipping fee per currency, in cents */
export const STANDARD_SHIPPING_FEE: Record<Currency, number> = {
  CHF: 690, // CHF 6.90
  EUR: 590, // EUR 5.90
};

/** Switzerland uses CHF; every other European country uses EUR */
export function getCurrencyForCountry(countryCode: string): Currency {
  return countryCode === "CH" ? "CHF" : "EUR";
}

/** Computes shipping cost for a given subtotal (in cents) */
export function calcShipping(subtotal: number, currency: Currency): number {
  return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_FEE[currency];
}

export const EUROPEAN_COUNTRIES: readonly { code: string; name: string }[] = [
  { code: "AT", name: "Austria" },
  { code: "BE", name: "Belgium" },
  { code: "BG", name: "Bulgaria" },
  { code: "CH", name: "Switzerland" },
  { code: "CY", name: "Cyprus" },
  { code: "CZ", name: "Czech Republic" },
  { code: "DE", name: "Germany" },
  { code: "DK", name: "Denmark" },
  { code: "EE", name: "Estonia" },
  { code: "ES", name: "Spain" },
  { code: "FI", name: "Finland" },
  { code: "FR", name: "France" },
  { code: "GB", name: "United Kingdom" },
  { code: "GR", name: "Greece" },
  { code: "HR", name: "Croatia" },
  { code: "HU", name: "Hungary" },
  { code: "IE", name: "Ireland" },
  { code: "IS", name: "Iceland" },
  { code: "IT", name: "Italy" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LT", name: "Lithuania" },
  { code: "LU", name: "Luxembourg" },
  { code: "LV", name: "Latvia" },
  { code: "MT", name: "Malta" },
  { code: "NL", name: "Netherlands" },
  { code: "NO", name: "Norway" },
  { code: "PL", name: "Poland" },
  { code: "PT", name: "Portugal" },
  { code: "RO", name: "Romania" },
  { code: "SE", name: "Sweden" },
  { code: "SI", name: "Slovenia" },
  { code: "SK", name: "Slovakia" },
] as const;
