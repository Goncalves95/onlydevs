// Script-only — bypasses server-only guard by instantiating Prisma directly
import { config } from "dotenv";
config({ path: ".env.local" });
import { PrismaClient } from "../lib/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

async function main() {
  const email = process.argv[2];
  if (!email) throw new Error("Usage: npx tsx scripts/make-admin.ts <email>");

  if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is not set");

  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  const user = await prisma.user.update({
    where: { email },
    data: { role: "ADMIN" },
  });
  console.log(`✅ ${user.email} is now ADMIN`);
  await prisma.$disconnect();
  await pool.end();
}

main().catch(console.error);
