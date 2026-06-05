import { auth } from "@/auth";
import { cookies } from "next/headers";
import { parseCurrencyCookie, getDefaultCurrency, CURRENCY_COOKIE } from "@/lib/currency";
import type { Locale } from "@/lib/i18n/routing";
import Navbar from "@/components/Navbar";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function StoreLayout({ children, params }: Props) {
  const { locale } = await params;
  const [session, cookieStore] = await Promise.all([auth(), cookies()]);
  const currency =
    parseCurrencyCookie(cookieStore.get(CURRENCY_COOKIE)?.value) ??
    getDefaultCurrency(locale as Locale);

  return (
    <>
      <Navbar
        currency={currency}
        isAuthenticated={!!session?.user?.id}
        locale={locale}
      />
      {children}
    </>
  );
}
