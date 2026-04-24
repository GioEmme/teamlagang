import { NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { news } from "@/lib/db/schema";
import { newsInputSchema } from "@/lib/validation";
import { requireAdmin } from "@/lib/admin";

export const runtime = "nodejs";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: Request, ctx: Ctx) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  const { id } = await ctx.params;

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

  // Load current row (to know current publishedAt for republish logic)
  const [current] = await db
    .select({
      id: news.id,
      slug: news.slug,
      publishedAt: news.publishedAt,
    })
    .from(news)
    .where(eq(news.id, id))
    .limit(1);
  if (!current) {
    return NextResponse.json({ error: "News non trovata" }, { status: 404 });
  }

  // Slug uniqueness if changed
  if (slug !== current.slug) {
    const [clash] = await db
      .select({ id: news.id })
      .from(news)
      .where(and(eq(news.slug, slug), ne(news.id, id)))
      .limit(1);
    if (clash) {
      return NextResponse.json(
        { error: "Slug già in uso, scegline un altro." },
        { status: 409 },
      );
    }
  }

  // publishedAt logic:
  //  - published=false → null (draft)
  //  - published=true + was draft → now()
  //  - published=true + was published → keep original timestamp
  const nextPublishedAt = published
    ? (current.publishedAt ?? new Date())
    : null;

  await db
    .update(news)
    .set({
      title,
      slug,
      excerpt,
      body: content,
      coverImage: coverImage ?? null,
      publishedAt: nextPublishedAt,
      updatedAt: new Date(),
    })
    .where(eq(news.id, id));

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  const { id } = await ctx.params;

  const [deleted] = await db
    .delete(news)
    .where(eq(news.id, id))
    .returning({ id: news.id });
  if (!deleted) {
    return NextResponse.json({ error: "News non trovata" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
