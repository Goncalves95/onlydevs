import { useTranslations } from "next-intl";
import { signIn } from "@/auth";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: "Sign In" };
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const t = useTranslations("auth");

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-2">{t("signIn")}</h1>
        <p className="text-zinc-400 text-sm mb-8">{t("signInSubtitle")}</p>

        <form
          action={async (formData: FormData) => {
            "use server";
            const params = await searchParams;
            await signIn("resend", {
              email: formData.get("email") as string,
              redirectTo: params.callbackUrl ?? "/",
            });
          }}
          className="space-y-4"
        >
          <input
            type="email"
            name="email"
            placeholder={t("emailPlaceholder")}
            required
            className="w-full bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:border-green-500 transition-colors"
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-black font-semibold py-2.5 rounded-md text-sm transition-colors"
          >
            {t("sendMagicLink")}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <hr className="flex-1 border-zinc-800" />
          <span className="text-zinc-500 text-xs">{t("or")}</span>
          <hr className="flex-1 border-zinc-800" />
        </div>

        <form
          action={async () => {
            "use server";
            const params = await searchParams;
            await signIn("google", {
              redirectTo: params.callbackUrl ?? "/",
            });
          }}
        >
          <button
            type="submit"
            className="w-full border border-zinc-700 hover:border-zinc-500 text-zinc-300 font-semibold py-2.5 rounded-md text-sm transition-colors"
          >
            {t("continueWithGoogle")}
          </button>
        </form>
      </div>
    </main>
  );
}
