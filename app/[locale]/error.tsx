"use client";

import { useEffect } from "react";
import Link from "next/link";

interface Props {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}

export default function ErrorPage({ error, unstable_retry }: Props) {
  useEffect(() => {
    // Log full error server-side only via digest; never expose stack to client
    console.error("[error-boundary]", error.digest ?? "no-digest");
  }, [error]);

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="font-mono text-center max-w-md">
        <p className="text-green-400 text-sm mb-6 opacity-60">onlydevs.store</p>

        <p className="text-zinc-300 text-lg font-medium mb-2">
          // 500 — something went wrong
        </p>
        <p className="text-zinc-600 text-sm mb-2">
          An unexpected error occurred. The team has been notified.
        </p>
        {error.digest && (
          <p className="text-zinc-700 text-xs mb-10 font-mono">
            ref: {error.digest}
          </p>
        )}
        {!error.digest && <div className="mb-10" />}

        <div className="flex items-center justify-center gap-4">
          <button
            onClick={unstable_retry}
            className="text-sm text-zinc-400 hover:text-white border border-zinc-700 hover:border-zinc-500 px-4 py-2 rounded-md transition-colors"
          >
            try again
          </button>
          <Link
            href="/"
            className="text-sm text-green-400 hover:text-green-300 border border-green-900 hover:border-green-700 px-4 py-2 rounded-md transition-colors"
          >
            go home
          </Link>
        </div>
      </div>
    </div>
  );
}
