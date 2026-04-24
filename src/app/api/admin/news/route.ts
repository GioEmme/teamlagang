import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { news } from "@/lib/db/schema";
import { newsInputSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/admin";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body non valido" }, { status: 400 });
  }

  const parsed = newsInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Dati non validi", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const { title, slug, excerpt, body: content, coverImage, published } =
    parsed.data;

  // Slug uniqueness check
  const [existing] = await db
    .select({ id: news.id })
    .from(news)
    .where(eq(news.slug, slug))
    .limit(1);
  if (existing) {
    return NextResponse.json(
      { error: "Slug già in uso, scegline un altro." },
      { status: 409 },
    );
  }

  const [row] = await db
    .insert(news)
    .values({
      title,
      slug,
      excerpt,
      body: content,
      coverImage: coverImage ?? null,
      publishedAt: published ? new Date() : null,
      authorId: guard.session.user.id,
    })
    .returning({ id: news.id, slug: news.slug });

  return NextResponse.json({ ok: true, id: row.id, slug: row.slug }, { status: 201 });
}
