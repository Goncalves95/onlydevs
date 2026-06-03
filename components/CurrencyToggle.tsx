"use client";

import { useTransition } from "react";
import { CURRENCY_COOKIE, type Currency } from "@/lib/currency";
import Cookies from "js-cookie";

interface Props {
  current: Currency;
}

export default function CurrencyToggle({ current }: Props) {
  const [, startTransition] = useTransition();

  function toggle() {
    const next: Currency = current === "CHF" ? "EUR" : "CHF";
    Cookies.set(CURRENCY_COOKIE, next, {
      expires: 365,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
    startTransition(() => {
      window.location.reload();
    });
  }

  return (
    <button
      onClick={toggle}
      className="font-mono text-xs px-2 py-1 rounded border border-zinc-700 hover:border-green-500 text-zinc-400 hover:text-green-400 transition-colors"
      aria-label={`Switch to ${current === "CHF" ? "EUR" : "CHF"}`}
    >
      {current === "CHF" ? "CHF → EUR" : "EUR → CHF"}
    </button>
  );
}
