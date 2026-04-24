import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { or, eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { users } from "@/lib/db/schema";
import { registerSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }

  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dati non validi", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { firstName, lastName, email, password, tesseraCode } = parsed.data;

  const existing = await db
    .select({ email: users.email, tesseraCode: users.tesseraCode })
    .from(users)
    .where(or(eq(users.email, email), eq(users.tesseraCode, tesseraCode)));

  if (existing.some((u) => u.email === email)) {
    return NextResponse.json(
      { error: "Indirizzo email già registrato." },
      { status: 409 },
    );
  }
  if (existing.some((u) => u.tesseraCode === tesseraCode)) {
    return NextResponse.json(
      { error: "Tessera già registrata." },
      { status: 409 },
    );
  }

  const passwordHash = await bcrypt.hash(password, 12);

  // Phase 2 temporary: auto-activate. Phase 3 flips to status='pending' + email verify.
  await db.insert(users).values({
    firstName,
    lastName,
    email,
    passwordHash,
    tesseraCode,
    status: "active",
    emailVerified: new Date(),
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
