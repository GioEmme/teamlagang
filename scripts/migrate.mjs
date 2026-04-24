// Custom migration runner — applies ./drizzle/*.sql via Neon HTTP driver.
// Avoids drizzle-kit's WebSocket dependency which hangs on some setups.
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.error("Missing DATABASE_URL_UNPOOLED / DATABASE_URL in .env.local");
  process.exit(1);
}

const sql = neon(url);

const dir = "./drizzle";
if (!existsSync(dir)) {
  console.error(`No ${dir} folder. Run: npm run db:generate`);
  process.exit(1);
}

// Track applied migrations in a tiny bookkeeping table.
await sql`
  CREATE TABLE IF NOT EXISTS __drizzle_migrations (
    id serial PRIMARY KEY,
    hash text NOT NULL UNIQUE,
    applied_at timestamp with time zone DEFAULT now()
  )
`;

const files = readdirSync(dir)
  .filter((f) => f.endsWith(".sql"))
  .sort();

if (files.length === 0) {
  console.log("No .sql files in ./drizzle");
  process.exit(0);
}

for (const file of files) {
  const hash = file;
  const [{ count }] = await sql`
    SELECT COUNT(*)::int AS count FROM __drizzle_migrations WHERE hash = ${hash}
  `;
  if (count > 0) {
    console.log(`SKIP ${file} (already applied)`);
    continue;
  }

  console.log(`APPLY ${file}`);
  const content = readFileSync(join(dir, file), "utf-8");
  const statements = content
    .split("--> statement-breakpoint")
    .map((s) => s.trim())
    .filter(Boolean);

  for (const stmt of statements) {
    await sql.query(stmt);
  }

  await sql`INSERT INTO __drizzle_migrations (hash) VALUES (${hash})`;
  console.log(`  ✓ ${statements.length} statement(s)`);
}

console.log("Done.");
process.exit(0);
