"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter, usePathname } from "@/lib/i18n/navigation";
import type { Locale } from "@/lib/i18n/routing";

const LOCALES: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English",   flag: "🇬🇧" },
  { code: "de", label: "Deutsch",   flag: "🇩🇪" },
  { code: "fr", label: "Français",  flag: "🇫🇷" },
  { code: "it", label: "Italiano",  flag: "🇮🇹" },
  { code: "pt", label: "Português", flag: "🇵🇹" },
];

interface Props {
  locale: string;
}

export default function LocaleSwitcher({ locale }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const ref = useRef<HTMLDivElement>(null);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function switchLocale(code: Locale) {
    setOpen(false);
    startTransition(() => {
      router.replace(pathname, { locale: code });
    });
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={isPending}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 font-mono text-xs px-2 py-1 rounded border border-zinc-700 hover:border-zinc-500 text-zinc-400 hover:text-white transition-colors disabled:opacity-40"
      >
        <span aria-hidden="true">{current.flag}</span>
        <span>{current.code.toUpperCase()}</span>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label="Select language"
          className="absolute right-0 top-full mt-1 min-w-[164px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl z-50 overflow-hidden py-1"
        >
          {LOCALES.map((l) => (
            <li key={l.code} role="none">
              <button
                role="option"
                aria-selected={l.code === locale}
                onClick={() => switchLocale(l.code)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors ${
                  l.code === locale
                    ? "text-green-400 bg-green-400/5"
                    : "text-zinc-300 hover:text-white hover:bg-green-400/5"
                }`}
              >
                <span className="text-base leading-none" aria-hidden="true">
                  {l.flag}
                </span>
                <span>{l.label}</span>
                {l.code === locale && (
                  <span className="ml-auto text-green-500 text-xs">✓</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
