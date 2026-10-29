import { and, desc, eq, gt, lte, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { banners } from "@/lib/db/schema";

export type ActiveBanner = {
  id: string;
  title: string | null;
  caption: string | null;
  imageUrl: string | null;
  linkUrl: string | null;
  showEveryVisit: boolean;
};

// Il banner attivo più recente dentro la sua finestra di validità.
export async function getActiveBanner(): Promise<ActiveBanner | null> {
  const [row] = await db
    .select({
      id: banners.id,
      title: banners.title,
      caption: banners.caption,
      imageUrl: banners.imageUrl,
      linkUrl: banners.linkUrl,
      showEveryVisit: banners.showEveryVisit,
    })
    .from(banners)
    .where(
      and(
        eq(banners.active, true),
        lte(banners.startsAt, sql`now()`),
        gt(banners.endsAt, sql`now()`),
      ),
    )
    .orderBy(desc(banners.updatedAt))
    .limit(1);
  return row ?? null;
}
