// TEMPORARY — delete after debugging Printful API connection
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const apiKey = process.env.PRINTFUL_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "PRINTFUL_API_KEY is not set" }, { status: 500 });
  }

  let raw: Response;
  try {
    raw = await fetch("https://api.printful.com/store/products", {
      headers: { Authorization: `Bearer ${apiKey}` },
      cache: "no-store",
    });
  } catch (err) {
    console.error("[debug/printful] fetch threw:", err);
    return NextResponse.json(
      { error: "Network error", detail: String(err) },
      { status: 502 }
    );
  }

  let body: unknown;
  try {
    body = await raw.json();
  } catch {
    const text = await raw.text().catch(() => "(unreadable)");
    console.error("[debug/printful] non-JSON body:", text);
    return NextResponse.json(
      { status: raw.status, error: "Non-JSON response", body: text },
      { status: 200 }
    );
  }

  if (!raw.ok) {
    console.error("[debug/printful] API error:", raw.status, body);
  }

  const result = body as { result?: { id: number; name: string }[]; code?: number };
  const first = result?.result?.[0];

  return NextResponse.json({
    apiKeyPresent: true,
    apiKeyPrefix: apiKey.slice(0, 8) + "…",
    httpStatus: raw.status,
    productCount: result?.result?.length ?? null,
    firstProductName: first?.name ?? null,
    printfulCode: result?.code ?? null,
  });
}
