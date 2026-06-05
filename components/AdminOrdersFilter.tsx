"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { OrderStatus } from "@/lib/generated/prisma/enums";

const ALL_STATUSES: OrderStatus[] = [
  "PENDING", "PAID", "FULFILLED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED",
];

interface Props {
  locale: string;
  initialQ: string;
  initialStatus: string;
}

export default function AdminOrdersFilter({ locale, initialQ, initialStatus }: Props) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);
  const [status, setStatus] = useState(initialStatus);

  function navigate(newQ: string, newStatus: string) {
    const params = new URLSearchParams();
    if (newQ.trim()) params.set("q", newQ.trim());
    if (newStatus) params.set("status", newStatus);
    const qs = params.toString();
    router.push(`/${locale}/admin/orders${qs ? `?${qs}` : ""}`);
  }

  return (
    <form
      onSubmit={(e) => { e.preventDefault(); navigate(q, status); }}
      className="flex flex-wrap gap-3"
    >
      <input
        type="text"
        placeholder="Search order ID or email…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="flex-1 min-w-[200px] bg-zinc-900 border border-zinc-700 rounded-md px-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors placeholder:text-zinc-600"
      />
      <select
        value={status}
        onChange={(e) => { setStatus(e.target.value); navigate(q, e.target.value); }}
        className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-purple-500 transition-colors text-zinc-300"
      >
        <option value="">All statuses</option>
        {ALL_STATUSES.map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>
      <button
        type="submit"
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-4 py-2 rounded-md text-sm transition-colors"
      >
        Search
      </button>
      {(q || status) && (
        <button
          type="button"
          onClick={() => { setQ(""); setStatus(""); navigate("", ""); }}
          className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors px-2"
        >
          Clear
        </button>
      )}
    </form>
  );
}
