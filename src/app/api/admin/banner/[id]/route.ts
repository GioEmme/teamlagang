import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { banners } from "@/lib/db/schema";
import { bannerInputSchema } from "@/lib/validation";
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

  const parsed = bannerInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: parsed.error.issues[0]?.message ?? "Dati non validi",
        details: parsed.error.flatten(),
      },
      { status: 400 },
    );
  }

  const b = parsed.data;
  const [updated] = await db
    .update(banners)
    .set({
      title: b.title,
      caption: b.caption,
      imageUrl: b.imageUrl ?? null,
      linkUrl: b.linkUrl ?? null,
      showEveryVisit: b.showEveryVisit,
      active: b.active,
      startsAt: new Date(b.startsAt),
      endsAt: new Date(b.endsAt),
      updatedAt: new Date(),
    })
    .where(eq(banners.id, id))
    .returning({ id: banners.id });
  if (!updated) {
    return NextResponse.json({ error: "Banner non trovato" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, ctx: Ctx) {
  const guard = await requireAdmin();
  if (guard.error) return guard.error;

  const { id } = await ctx.params;

  const [deleted] = await db
    .delete(banners)
    .where(eq(banners.id, id))
    .returning({ id: banners.id });
  if (!deleted) {
    return NextResponse.json({ error: "Banner non trovato" }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
