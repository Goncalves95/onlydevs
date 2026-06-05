/**
 * Generates a full SQL migration script from the Prisma schema.
 *
 * Run this script to produce prisma/migrations/production-init.sql,
 * then paste that SQL into the Supabase SQL Editor on the production project.
 *
 * Usage:
 *   npx tsx scripts/generate-migration-sql.ts
 */
import { execSync } from "child_process";
import { mkdirSync } from "fs";
import path from "path";

const outputDir = path.join(process.cwd(), "prisma", "migrations");
const outputFile = path.join(outputDir, "production-init.sql");

mkdirSync(outputDir, { recursive: true });

console.log("Generating production SQL migration from schema…");

execSync(
  [
    "npx prisma migrate diff",
    "--from-empty",
    "--to-schema-datamodel prisma/schema.prisma",
    "--script",
    `--output "${outputFile}"`,
  ].join(" "),
  { stdio: "inherit" }
);

console.log(`\n✅ SQL written to ${outputFile}`);
console.log("   Paste it into the Supabase SQL Editor for your production project.");
