"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/lib/i18n/navigation";

const SPLASH_KEY = "onlydevs_splash_seen";

export default function SplashPage() {
  const t = useTranslations("hero");
  const router = useRouter();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SPLASH_KEY)) {
      router.replace("/products");
    } else {
      sessionStorage.setItem(SPLASH_KEY, "1");
      setShow(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!show) return null;

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
