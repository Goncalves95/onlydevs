"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/lib/i18n/navigation";

const CONSENT_KEY = "onlydevs_cookie_consent";

export default function CookieBanner() {
  const t = useTranslations("gdpr");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(CONSENT_KEY)) {
      setVisible(true);
    }
  }, []);

  function accept() {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-800 bg-zinc-950/95 backdrop-blur-md"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">

        {/* Icon + text */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="font-mono text-green-500 text-xs mt-0.5 shrink-0 select-none">
            $
          </span>
          <div className="min-w-0">
            <p className="font-mono text-xs text-zinc-500 mb-0.5">
              // cookies.config
            </p>
            <p className="text-sm text-zinc-300 leading-snug">
              {t("message")}{" "}
              <Link
                href="/cookies"
                className="text-green-400 hover:underline font-mono text-xs whitespace-nowrap"
              >
                {t("learnMore")} →
              </Link>
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/cookies"
            className="font-mono text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            {t("cookiePolicy")}
          </Link>
          <button
            onClick={accept}
            className="bg-green-500 hover:bg-green-400 text-black font-bold text-xs px-4 py-2 rounded-md transition-colors font-mono"
          >
            {t("accept")}
          </button>
        </div>
      </div>
    </div>
  );
}
