import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { news } from "@/lib/db/schema";
import { NewsForm } from "@/components/admin/NewsForm";

export const metadata: Metadata = {
  title: "Modifica news",
  robots: { index: false, follow: false },
};

export default async function EditNewsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [row] = await db.select().from(news).where(eq(news.id, id)).limit(1);
  if (!row) notFound();

  return (
    <section className="mx-auto max-w-6xl px-5 md:px-10 py-16 md:py-24">
      <Link
        href="/area-riservata/admin/news"
        className="inline-block font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint hover:text-yellow transition-colors mb-8"
      >
        ← Articoli
      </Link>
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-yellow mb-3">
        {row.publishedAt ? "Pubblicata" : "Bozza"}
      </div>
      <h1 className="text-display text-[clamp(2rem,5vw,3.5rem)] leading-[0.95] mb-12 line-clamp-2">
        {row.title}
      </h1>

      <NewsForm
        initial={{
          id: row.id,
          title: row.title,
          slug: row.slug,
          excerpt: row.excerpt,
          body: row.body,
          coverImage: row.coverImage,
          published: Boolean(row.publishedAt),
        }}
      />
    </section>
  );
}
