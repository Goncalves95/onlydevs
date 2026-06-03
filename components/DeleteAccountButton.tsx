"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";

interface Props {
  locale: string;
  labels: {
    deleteAccount: string;
    deleteWarning: string;
    deleteCancel: string;
    confirmDelete: string;
  };
}

export default function DeleteAccountButton({ locale, labels }: Props) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch("/api/account", { method: "DELETE" });
      if (res.ok) {
        await signOut({ callbackUrl: `/${locale}` });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-red-400 hover:text-red-300 underline underline-offset-4 transition-colors"
      >
        {labels.deleteAccount}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-zinc-700 rounded-xl p-6 max-w-sm w-full space-y-4 shadow-2xl">
            <p className="text-sm text-zinc-300 leading-relaxed">{labels.deleteWarning}</p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setOpen(false)}
                disabled={loading}
                className="px-4 py-2 text-sm rounded-md border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {labels.deleteCancel}
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-sm rounded-md bg-red-500 hover:bg-red-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-semibold transition-colors"
              >
                {loading ? "…" : labels.confirmDelete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
