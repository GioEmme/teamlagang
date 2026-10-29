import { NextResponse } from "next/server";
import { db } from "@/lib/db/client";
import { banners } from "@/lib/db/schema";
import { bannerInputSchema } from "@/lib/validation";
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
  const [row] = await db
    .insert(banners)
    .values({
      title: b.title,
      caption: b.caption,
      imageUrl: b.imageUrl ?? null,
      linkUrl: b.linkUrl ?? null,
      showEveryVisit: b.showEveryVisit,
      active: b.active,
      startsAt: new Date(b.startsAt),
      endsAt: new Date(b.endsAt),
    })
    .returning({ id: banners.id });

  return NextResponse.json({ ok: true, id: row.id }, { status: 201 });
}
