import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import AccountNav from "@/components/AccountNav";

interface Props {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AccountLayout({ children, params }: Props) {
  const { locale } = await params;

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/${locale}/login`);
  }

  const t = await getTranslations({ locale, namespace: "account.nav" });

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row gap-8">
      <AccountNav
        locale={locale}
        labels={{
          orders: t("orders"),
          profile: t("profile"),
          addresses: t("addresses"),
          signOut: t("signOut"),
        }}
      />
      {/* Extra bottom padding on mobile so bottom nav doesn't overlap content */}
      <main className="flex-1 min-w-0 pb-24 md:pb-0">
        {children}
      </main>
    </div>
  );
}
