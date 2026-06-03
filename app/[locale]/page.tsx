import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

export default function HomePage() {
  const t = useTranslations("hero");

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 py-24">
      <div className="text-center">
        <p className="font-mono text-sm text-green-500 mb-4">{t("tagline")}</p>
        <h1 className="text-5xl font-bold tracking-tight mb-4 cursor-blink">
          {t("title")}
        </h1>
        <p className="text-zinc-400 text-lg max-w-md mx-auto">{t("subtitle")}</p>
        <div className="mt-10 flex gap-4 justify-center">
          <Link
            href="/products"
            className="bg-green-500 hover:bg-green-600 text-black font-semibold px-6 py-3 rounded-md transition-colors"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </main>
  );
}
