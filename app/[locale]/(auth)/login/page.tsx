import { getTranslations } from "next-intl/server";
import LoginForm from "@/components/LoginForm";
import type { Locale } from "@/lib/i18n/routing";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "auth" });
  return { title: t("signIn") };
}

export default async function LoginPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { callbackUrl, error } = await searchParams;

  const defaultCallback = `/${locale}`;
  const safeCallback = callbackUrl?.startsWith("/") ? callbackUrl : defaultCallback;

  // Map Auth.js error codes to translation keys
  const initialError = error
    ? error === "OAuthAccountNotLinked"
      ? "This email is already linked to another sign-in method."
      : error === "AccessDenied"
      ? "Access denied."
      : error === "Verification"
      ? "The magic link has expired. Please request a new one."
      : null
    : null;

  return (
    <main className="flex min-h-[calc(100vh-60px)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
          <p className="text-zinc-400 text-sm">Sign in or create your OnlyDevs account.</p>
        </div>
        <LoginForm
          locale={locale}
          callbackUrl={safeCallback}
          initialError={initialError ?? undefined}
        />
      </div>
    </main>
  );
}
