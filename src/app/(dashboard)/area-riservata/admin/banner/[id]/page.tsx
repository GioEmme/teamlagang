import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { banners } from "@/lib/db/schema";
import { BannerForm } from "@/components/admin/BannerForm";

export const metadata: Metadata = {
  title: "Modifica banner",
  robots: { index: false, follow: false },
};

export default async function EditBannerPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [row] = await db.select().from(banners).where(eq(banners.id, id)).limit(1);
  if (!row) notFound();

  return (
    <section className="mx-auto max-w-4xl px-5 md:px-10 py-16 md:py-24">
      <Link
        href="/area-riservata/admin/banner"
        className="inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint hover:text-yellow transition-colors mb-8"
      >
        ← Banner
      </Link>
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-yellow mb-3">
        {row.active ? "Attivo" : "Disattivato"}
      </div>
      <h1 className="text-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] mb-12 line-clamp-2">
        {row.title || "Banner"}
      </h1>

      <BannerForm
        initial={{
          id: row.id,
          title: row.title ?? "",
          caption: row.caption ?? "",
          imageUrl: row.imageUrl ?? "",
          linkUrl: row.linkUrl ?? "",
          showEveryVisit: row.showEveryVisit,
          active: row.active,
          startsAt: row.startsAt.toISOString(),
          endsAt: row.endsAt.toISOString(),
        }}
      />
    </section>
  );
}
