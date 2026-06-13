import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { Locale } from "@/lib/i18n/routing";

interface Props {
  params: Promise<{ locale: Locale }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account.nav" });
  return { title: t("addresses") };
}

export default async function AddressesPage({ params }: Props) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.id) notFound();
  const userId = session.user.id;

  const [t, addresses] = await Promise.all([
    getTranslations({ locale, namespace: "account.addresses" }),
    prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { id: "asc" }],
    }),
  ]);

  async function deleteAddress(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    await prisma.address.deleteMany({ where: { id, userId } });
    revalidatePath(`/${locale}/account/addresses`);
  }

  async function setDefault(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    if (!id) return;
    await prisma.$transaction([
      prisma.address.updateMany({ where: { userId }, data: { isDefault: false } }),
      prisma.address.update({ where: { id }, data: { isDefault: true } }),
    ]);
    revalidatePath(`/${locale}/account/addresses`);
  }

  return (
    <section className="space-y-8 max-w-lg">
      <h1 className="text-2xl font-bold">{t("title")}</h1>

      {addresses.length === 0 ? (
        <div className="border border-zinc-800 rounded-lg p-8 text-center">
          <p className="font-mono text-xs text-green-600 mb-2">// no.addresses.saved</p>
          <p className="text-zinc-400 text-sm leading-relaxed">{t("emptyNote")}</p>
        </div>
      ) : (
        <ul className="space-y-4">
          {addresses.map((addr) => (
            <li
              key={addr.id}
              className="border border-zinc-800 rounded-lg p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="text-sm text-zinc-300 leading-relaxed">
                  <p>{addr.line1}</p>
                  {addr.line2 && <p>{addr.line2}</p>}
                  <p>
                    {addr.city}
                    {addr.state ? `, ${addr.state}` : ""} {addr.postalCode}
                  </p>
                  <p className="uppercase text-xs text-zinc-500 mt-0.5">{addr.country}</p>
                </div>
                {addr.isDefault && (
                  <span className="shrink-0 text-[10px] font-mono border border-green-500/40 text-green-400 rounded px-2 py-0.5">
                    {t("default")}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 pt-1 border-t border-zinc-800">
                {!addr.isDefault && (
                  <form action={setDefault}>
                    <input type="hidden" name="id" value={addr.id} />
                    <button
                      type="submit"
                      className="text-xs text-zinc-400 hover:text-green-400 transition-colors"
                    >
                      {t("setDefault")}
                    </button>
                  </form>
                )}
                <form action={deleteAddress}>
                  <input type="hidden" name="id" value={addr.id} />
                  <button
                    type="submit"
                    className="text-xs text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    {t("delete")}
                  </button>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}

      <p className="text-xs text-zinc-600 font-mono leading-relaxed">
        {t("checkoutNote")}
      </p>
    </section>
  );
}
