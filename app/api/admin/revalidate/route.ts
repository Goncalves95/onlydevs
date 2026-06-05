import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const session = await auth();
  if (session?.user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json().catch(() => ({}));
  const tag: string = typeof body.tag === "string" ? body.tag : "products";

  revalidateTag(tag, "max");

  return NextResponse.json({ revalidated: true, tag });
}
