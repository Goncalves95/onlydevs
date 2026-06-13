// TODO: i18n — content is English-only; translate per locale when copy review is complete
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Size charts for OnlyDevs t-shirts and hoodies.",
};

const TEE_SIZES = [
  { size: "XS",  chestCm: 91,  lengthCm: 68, chestIn: "35.8", lengthIn: "26.8" },
  { size: "S",   chestCm: 97,  lengthCm: 71, chestIn: "38.2", lengthIn: "28.0" },
  { size: "M",   chestCm: 104, lengthCm: 74, chestIn: "41.0", lengthIn: "29.1" },
  { size: "L",   chestCm: 111, lengthCm: 76, chestIn: "43.7", lengthIn: "29.9" },
  { size: "XL",  chestCm: 119, lengthCm: 78, chestIn: "46.9", lengthIn: "30.7" },
  { size: "2XL", chestCm: 127, lengthCm: 81, chestIn: "50.0", lengthIn: "31.9" },
  { size: "3XL", chestCm: 135, lengthCm: 83, chestIn: "53.1", lengthIn: "32.7" },
];

const HOODIE_SIZES = [
  { size: "XS",  chestCm: 95,  lengthCm: 66, sleeveCm: 82 },
  { size: "S",   chestCm: 100, lengthCm: 69, sleeveCm: 84 },
  { size: "M",   chestCm: 107, lengthCm: 72, sleeveCm: 86 },
  { size: "L",   chestCm: 115, lengthCm: 74, sleeveCm: 89 },
  { size: "XL",  chestCm: 123, lengthCm: 77, sleeveCm: 91 },
  { size: "2XL", chestCm: 130, lengthCm: 80, sleeveCm: 94 },
  { size: "3XL", chestCm: 138, lengthCm: 82, sleeveCm: 96 },
];

export default function SizeGuidePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">

      {/* Header */}
      <div className="mb-12">
        <p className="font-mono text-green-500 text-xs mb-3">// size.guide</p>
        <h1 className="text-3xl font-bold mb-3">Size Guide</h1>
        <div className="space-y-1 font-mono text-xs text-zinc-500">
          <p>Measurements are of the <span className="text-zinc-300">garment</span>, not body measurements.</p>
          <p>When in doubt, <span className="text-green-400">size up</span>.</p>
        </div>
      </div>

      <div className="space-y-14">

        {/* T-Shirts */}
        <section id="tshirts">
          <p className="font-mono text-xs text-zinc-500 mb-3">// 01. unisex.tshirts</p>
          <h2 className="text-xl font-bold mb-1">Unisex T-Shirts</h2>
          <p className="text-xs text-zinc-500 font-mono mb-6">
            Bella+Canvas 3001 — premium ring-spun cotton
          </p>

          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-3 pr-4 text-zinc-400 font-semibold w-16">Size</th>
                  <th className="text-right py-3 px-4 text-zinc-400 font-semibold">Chest (cm)</th>
                  <th className="text-right py-3 px-4 text-zinc-400 font-semibold">Length (cm)</th>
                  <th className="text-right py-3 px-4 text-zinc-400 font-semibold">Chest (in)</th>
                  <th className="text-right py-3 pl-4 text-zinc-400 font-semibold">Length (in)</th>
                </tr>
              </thead>
              <tbody>
                {TEE_SIZES.map((row, i) => (
                  <tr
                    key={row.size}
                    className={`border-b border-zinc-800 ${i % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900"}`}
                  >
                    <td className="py-3 pr-4 text-green-400 font-bold">{row.size}</td>
                    <td className="py-3 px-4 text-right text-zinc-300">{row.chestCm}</td>
                    <td className="py-3 px-4 text-right text-zinc-300">{row.lengthCm}</td>
                    <td className="py-3 px-4 text-right text-zinc-500">{row.chestIn}</td>
                    <td className="py-3 pl-4 text-right text-zinc-500">{row.lengthIn}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Hoodies */}
        <section id="hoodies">
          <p className="font-mono text-xs text-zinc-500 mb-3">// 02. hoodies</p>
          <h2 className="text-xl font-bold mb-1">Hoodies &amp; Sweatshirts</h2>
          <p className="text-xs text-zinc-500 font-mono mb-6">
            Premium fleece — runs slightly larger than tees
          </p>

          <div className="overflow-x-auto">
            <table className="w-full font-mono text-sm border-collapse">
              <thead>
                <tr className="border-b border-zinc-700">
                  <th className="text-left py-3 pr-4 text-zinc-400 font-semibold w-16">Size</th>
                  <th className="text-right py-3 px-4 text-zinc-400 font-semibold">Chest (cm)</th>
                  <th className="text-right py-3 px-4 text-zinc-400 font-semibold">Length (cm)</th>
                  <th className="text-right py-3 pl-4 text-zinc-400 font-semibold">Sleeve (cm)</th>
                </tr>
              </thead>
              <tbody>
                {HOODIE_SIZES.map((row, i) => (
                  <tr
                    key={row.size}
                    className={`border-b border-zinc-800 ${i % 2 === 0 ? "bg-zinc-950" : "bg-zinc-900"}`}
                  >
                    <td className="py-3 pr-4 text-green-400 font-bold">{row.size}</td>
                    <td className="py-3 px-4 text-right text-zinc-300">{row.chestCm}</td>
                    <td className="py-3 px-4 text-right text-zinc-300">{row.lengthCm}</td>
                    <td className="py-3 pl-4 text-right text-zinc-300">{row.sleeveCm}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* How to measure */}
        <section id="how-to-measure">
          <p className="font-mono text-xs text-zinc-500 mb-3">// 03. how.to.measure</p>
          <h2 className="text-xl font-bold mb-5">How to Measure</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                label: "Chest",
                desc: "Measure around the fullest part of your chest, keeping the tape horizontal.",
              },
              {
                label: "Length",
                desc: "Measure from the highest point of the shoulder down to the bottom hem.",
              },
              {
                label: "Sleeve",
                desc: "Measure from the shoulder seam to the end of the sleeve cuff.",
              },
            ].map((m) => (
              <div key={m.label} className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg">
                <p className="font-mono text-xs text-green-500 mb-1">{m.label}</p>
                <p className="text-xs text-zinc-400 leading-relaxed">{m.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Still unsure */}
        <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
          <p className="font-mono text-xs text-zinc-500 mb-2">// still.unsure</p>
          <p className="text-sm text-zinc-400 mb-4">
            Not sure which size to pick? Drop us a message and we&apos;ll help you choose.
          </p>
          <a
            href="mailto:onlydevs.shop@gmail.com"
            className="inline-block font-mono text-sm font-bold text-black bg-green-500 hover:bg-green-400 transition-colors px-5 py-2.5 rounded-md"
          >
            onlydevs.shop@gmail.com →
          </a>
        </div>
      </div>
    </main>
  );
}
