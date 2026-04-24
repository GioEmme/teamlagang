import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

function mask(u) {
  if (!u) return "(missing)";
  try {
    const url = new URL(u);
    const pwd = url.password ?? "";
    const masked = pwd ? `${pwd.slice(0, 4)}***${pwd.slice(-2)}` : "(empty)";
    return `${url.protocol}//${url.username}:${masked}@${url.host}${url.pathname}?${url.searchParams.toString()}`;
  } catch (e) {
    return `(unparseable: ${e.message})`;
  }
}

async function test(label, url) {
  console.log(`\n[${label}]`, mask(url));
  if (!url) return;
  try {
    const sql = neon(url);
    const [row] = await sql`SELECT current_user, current_database()`;
    console.log(`  ✓ OK — user=${row.current_user} db=${row.current_database}`);
  } catch (e) {
    console.log(`  ✗ FAIL — ${e.message}`);
    if (e.cause) console.log(`    cause: ${e.cause.message ?? e.cause}`);
  }
}

await test("POOLED (DATABASE_URL)", process.env.DATABASE_URL);
await test("DIRECT (DATABASE_URL_UNPOOLED)", process.env.DATABASE_URL_UNPOOLED);
