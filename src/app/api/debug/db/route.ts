import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  // Gate to non-production only. In prod returns 404 so endpoint isn't probeable.
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const url = process.env.DATABASE_URL;
  const urlMasked = url
    ? url.replace(/:[^@/]+@/, ":***@")
    : "(DATABASE_URL missing)";

  async function runFetch(label: string, target: string, opts?: RequestInit) {
    try {
      const res = await fetch(target, opts);
      return `OK status=${res.status}`;
    } catch (e) {
      const err = e as Error & { cause?: { message?: string } };
      return `FAIL: ${err.message} cause=${err.cause?.message ?? "(none)"}`;
    }
  }

  const google = await runFetch("google", "https://www.google.com", {
    method: "HEAD",
  });

  let neonHead = "skipped";
  if (url) {
    try {
      const u = new URL(url);
      neonHead = await runFetch(
        "neon-head",
        `https://${u.host}/`,
        { method: "HEAD" },
      );
    } catch (e) {
      neonHead = `URL parse error: ${(e as Error).message}`;
    }
  }

  let neonDb = "skipped";
  if (url) {
    try {
      const { neon } = await import("@neondatabase/serverless");
      const sql = neon(url);
      const rows = await sql`SELECT 1 AS ok`;
      neonDb = `OK rows=${JSON.stringify(rows)}`;
    } catch (e) {
      const err = e as Error & { cause?: { message?: string } };
      neonDb = `FAIL: ${err.message} cause=${err.cause?.message ?? "(none)"}`;
    }
  }

  return NextResponse.json({
    url: urlMasked,
    env: {
      NODE_VERSION: process.version,
      NODE_TLS_REJECT_UNAUTHORIZED: process.env.NODE_TLS_REJECT_UNAUTHORIZED,
      HTTPS_PROXY: process.env.HTTPS_PROXY ?? null,
      HTTP_PROXY: process.env.HTTP_PROXY ?? null,
      NO_PROXY: process.env.NO_PROXY ?? null,
    },
    tests: { google, neonHead, neonDb },
  });
}
