// Usage: node scripts/promote-admin.mjs <email>
// Sets role='admin' for the given user.
import { config } from "dotenv";
import { neon } from "@neondatabase/serverless";

config({ path: ".env.local" });

const email = process.argv[2];
if (!email) {
  console.error("Usage: node scripts/promote-admin.mjs <email>");
  process.exit(1);
}

const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
if (!url) {
  console.error("Missing DATABASE_URL_UNPOOLED / DATABASE_URL");
  process.exit(1);
}

const sql = neon(url);

const rows = await sql`
  UPDATE users SET role = 'admin' WHERE email = ${email}
  RETURNING email, role, first_name, last_name
`;

if (rows.length === 0) {
  console.error(`No user found with email: ${email}`);
  process.exit(1);
}

console.log("✓ promoted:", rows[0]);
