"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface Props {
  locale: string;
  initialQ: string;
}

export default function AdminCustomersFilter({ locale, initialQ }: Props) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);

  function navigate(newQ: string) {
    const params = new URLSearchParams();
    if (newQ.trim()) params.set("q", newQ.trim());
    const qs = params.toString();
    router.push(`/${locale}/admin/customers${qs ? `?${qs}` : ""}`);
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); navigate(q); }}
      className="flex gap-3"
    >
      <input
        type="text"
        placeholder="Search by email…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="flex-1 max-w-sm bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600"
      />
      <button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-md text-sm transition-colors"
      >
        Search
      </button>
      {q && (
        <button
          type="button"
          onClick={() => { setQ(""); navigate(""); }}
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors px-2"
        >
          Clear
        </button>
      )}
    </form>
  );
}
