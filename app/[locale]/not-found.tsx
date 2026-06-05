import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
      <div className="font-mono text-center max-w-md">
        <p className="text-green-400 text-sm mb-6 opacity-60">onlydevs.store</p>

        <pre className="text-zinc-500 text-xs mb-8 leading-relaxed select-none">{`
  ██╗  ██╗ ██████╗ ██╗  ██╗
  ██║  ██║██╔═══██╗██║  ██║
  ███████║██║   ██║███████║
  ╚════██║██║   ██║╚════██║
       ██║╚██████╔╝     ██║
       ╚═╝ ╚═════╝      ╚═╝
        `.trim()}</pre>

        <p className="text-zinc-300 text-lg font-medium mb-2">
          // 404 — page not found
        </p>
        <p className="text-zinc-600 text-sm mb-10">
          The route you&apos;re looking for doesn&apos;t exist or was moved.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-green-400 hover:text-green-300 border border-green-900 hover:border-green-700 px-5 py-2.5 rounded-md transition-colors"
        >
          <span className="opacity-60">~/</span> return home
        </Link>
      </div>
    </div>
  );
}
