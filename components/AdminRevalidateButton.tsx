"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function AdminRevalidateButton() {
  const [status, setStatus] = useState<Status>("idle");

  async function handleClick() {
    setStatus("loading");
    try {
      const res = await fetch("/api/admin/revalidate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tag: "products" }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("success");
    } catch {
      setStatus("error");
    } finally {
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === "loading"}
      className={`inline-flex items-center gap-2 text-sm px-3 py-1.5 rounded-md border transition-colors disabled:opacity-50 ${
        status === "success"
          ? "text-green-400 border-green-800 bg-green-400/5"
          : status === "error"
          ? "text-red-400 border-red-800 bg-red-400/5"
          : "text-zinc-300 border-zinc-700 hover:border-zinc-500 hover:text-white"
      }`}
    >
      {status === "loading" ? (
        <>
          <SpinnerIcon />
          Revalidating…
        </>
      ) : status === "success" ? (
        <>✓ Cache cleared</>
      ) : status === "error" ? (
        <>✗ Failed — retry?</>
      ) : (
        <>
          <RefreshIcon />
          Revalidate Cache
        </>
      )}
    </button>
  );
}

function RefreshIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polyline points="23 4 23 10 17 10" />
      <polyline points="1 20 1 14 7 14" />
      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
    </svg>
  );
}

function SpinnerIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="animate-spin">
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );
}
