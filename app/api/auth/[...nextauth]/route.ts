import { handlers } from "@/auth";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("[auth-route] GET", req.url);
  return handlers.GET(req);
}

export async function POST(req: NextRequest) {
  console.log("[auth-route] POST", req.url);
  return handlers.POST(req);
}
