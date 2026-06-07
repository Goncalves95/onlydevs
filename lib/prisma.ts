import "server-only";
import { PrismaClient } from "@/lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

console.log("[prisma-debug] MODULE LOAD — DATABASE_URL present:", !!process.env.DATABASE_URL);
console.log(
  "[prisma-debug] DATABASE_URL host:",
  process.env.DATABASE_URL?.split("@")[1]?.split("/")[0] ?? "(none)"
);
console.log("[prisma-debug] globalThis.prisma cached:", !!globalThis.prisma);

function createPrismaClient() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
  });
}

export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma;
