import { notFound } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getTranslations } from "next-intl/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import AddressesPanel from "@/components/AddressesPanel";
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

  async function saveAddress(formData: FormData) {
    "use server";
    const id = (formData.get("id") as string | null) || null;
    const line1 = ((formData.get("line1") as string) ?? "").trim();
    const line2 = ((formData.get("line2") as string) ?? "").trim() || null;
    const city = ((formData.get("city") as string) ?? "").trim();
    const state = ((formData.get("state") as string) ?? "").trim() || null;
    const postalCode = ((formData.get("postalCode") as string) ?? "").trim();
    const country = ((formData.get("country") as string) ?? "").trim();

    if (!line1 || !city || !postalCode || !country) return;

    if (id) {
      // Verify ownership before update
      await prisma.address.updateMany({
        where: { id, userId },
        data: { line1, line2, city, state, postalCode, country },
      });
    } else {
      // First address becomes the default automatically
      const count = await prisma.address.count({ where: { userId } });
      await prisma.address.create({
        data: {
          userId,
          line1,
          line2,
          city,
          state,
          postalCode,
          country,
          isDefault: count === 0,
        },
      });
    }
    revalidatePath(`/${locale}/account/addresses`);
  }

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
    // Verify ownership before setting default
    const addr = await prisma.address.findFirst({ where: { id, userId } });
    if (!addr) return;
    await prisma.$transaction([
      prisma.address.updateMany({ where: { userId }, data: { isDefault: false } }),
      prisma.address.update({ where: { id }, data: { isDefault: true } }),
    ]);
    revalidatePath(`/${locale}/account/addresses`);
  }

  return (
    <section className="space-y-8 max-w-lg">
      <h1 className="text-2xl font-bold">{t("title")}</h1>
      <AddressesPanel
        addresses={addresses}
        onSave={saveAddress}
        onDelete={deleteAddress}
        onSetDefault={setDefault}
        labels={{
          emptyNote: t("emptyNote"),
          defaultBadge: t("default"),
          setDefault: t("setDefault"),
          deleteLabel: t("delete"),
          checkoutNote: t("checkoutNote"),
        }}
      />
    </section>
  );
}
