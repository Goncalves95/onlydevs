"use client";

import { usePathname } from "@/lib/i18n/navigation";
import Navbar from "@/components/Navbar";
import type { Currency } from "@/lib/currency";

interface Props {
  currency: Currency;
  isAuthenticated: boolean;
  isAdmin: boolean;
  locale: string;
}

export default function NavbarWrapper({ currency, isAuthenticated, isAdmin, locale }: Props) {
  const pathname = usePathname();
  // usePathname() returns the locale-stripped path, e.g. /admin/... for /en/admin/...
  if (pathname.startsWith("/admin")) return null;
  return <Navbar currency={currency} isAuthenticated={isAuthenticated} isAdmin={isAdmin} locale={locale} />;
}
