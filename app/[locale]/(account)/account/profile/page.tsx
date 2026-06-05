import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import DeleteAccountButton from "@/components/DeleteAccountButton";
import PasswordSection from "@/components/PasswordSection";
import type { Locale } from "@/lib/i18n/routing";

interface Props {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ setup?: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account.profile" });
  return { title: t("title") };
}

export default async function ProfilePage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { setup } = await searchParams;
  const showSetupBanner = setup === "password";
  const session = await auth();
  if (!session?.user?.id) notFound();
  const userId = session.user.id;

  const [t, user] = await Promise.all([
    getTranslations({ locale, namespace: "account.profile" }),
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, password: true },
    }),
  ]);

  if (!user) notFound();

  // Derive boolean only — never pass the hash to the template
  const hasPassword = !!user.password;

  async function updateName(formData: FormData) {
    "use server";
    const name = (formData.get("name") as string).trim().slice(0, 100);
    await prisma.user.update({ where: { id: userId }, data: { name: name || null } });
    revalidatePath(`/${locale}/account/profile`);
  }

  return (
    <section className="space-y-10 max-w-lg">
      {showSetupBanner && (
        <div className="flex gap-3 bg-green-500/10 border border-green-500/40 rounded-lg px-4 py-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 shrink-0 mt-0.5" aria-hidden="true">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p className="text-sm text-green-300">{t("setupBanner")}</p>
        </div>
      )}

      <h1 className="text-2xl font-bold">{t("title")}</h1>

      {/* Profile form */}
      <form action={updateName} className="space-y-5">
        {/* Display name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
            {t("nameLabel")}
          </label>
          <input
            id="name"
            name="name"
            type="text"
            defaultValue={user.name ?? ""}
            maxLength={100}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-colors"
          />
        </div>

        {/* Email (read-only) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-medium text-zinc-400 uppercase tracking-wider">
            {t("emailLabel")}
          </label>
          <p className="text-sm text-zinc-300 bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5">
            {user.email}
          </p>
          <p className="text-xs text-zinc-600">{t("emailNote")}</p>
        </div>

        <button
          type="submit"
          className="bg-green-500 hover:bg-green-600 text-black font-semibold px-5 py-2.5 rounded-md text-sm transition-colors"
        >
          {t("saveChanges")}
        </button>
      </form>

      {/* Security section */}
      <PasswordSection hasPassword={hasPassword} />

      {/* GDPR section */}
      <div className="border-t border-zinc-800 pt-8 space-y-5">
        <h2 className="text-sm font-semibold text-zinc-300 uppercase tracking-wider">
          {t("gdprTitle")}
        </h2>

        {/* Export */}
        <div className="space-y-1">
          <a
            href="/api/account/export"
            download="onlydevs-data.json"
            className="inline-block text-sm text-zinc-300 hover:text-green-400 underline underline-offset-4 transition-colors"
          >
            {t("exportData")}
          </a>
          <p className="text-xs text-zinc-600">{t("exportNote")}</p>
        </div>

        {/* Delete */}
        <DeleteAccountButton
          locale={locale}
          labels={{
            deleteAccount: t("deleteAccount"),
            deleteWarning: t("deleteWarning"),
            deleteCancel: t("deleteCancel"),
            confirmDelete: t("confirmDelete"),
          }}
        />
      </div>
    </section>
  );
}
