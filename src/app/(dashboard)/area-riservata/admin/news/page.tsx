import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { news } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Admin · News",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminNewsList() {
  const rows = await db
    .select({
      id: news.id,
      title: news.title,
      slug: news.slug,
      publishedAt: news.publishedAt,
      updatedAt: news.updatedAt,
      createdAt: news.createdAt,
    })
    .from(news)
    .orderBy(desc(news.updatedAt));

  return (
    <section className="mx-auto max-w-6xl px-5 md:px-10 py-16 md:py-24">
      <div className="flex items-start justify-between gap-6 mb-12">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-yellow mb-3">
            Admin · News
          </div>
          <h1 className="text-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.9]">
            Articoli.
          </h1>
        </div>
        <Link
          href="/area-riservata/admin/news/nuova"
          className="whitespace-nowrap px-5 py-3 bg-yellow text-bg font-mono text-xs uppercase tracking-widest font-semibold hover:bg-yellow-hot transition-colors"
        >
          + Nuova
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="border border-dashed border-white/10 px-6 py-16 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
            Nessuna news. Crea la prima →
          </p>
        </div>
      ) : (
        <div className="border border-white/10 divide-y divide-white/10">
          {rows.map((r) => {
            const isDraft = !r.publishedAt;
            return (
              <Link
                key={r.id}
                href={`/area-riservata/admin/news/${r.id}`}
                className="flex items-center gap-4 px-4 md:px-6 py-5 hover:bg-bg-elev transition-colors group"
              >
                <span
                  className={`flex-none font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 ${
                    isDraft
                      ? "border border-white/20 text-ink-dim"
                      : "bg-yellow text-bg"
                  }`}
                >
                  {isDraft ? "Bozza" : "Pubblicata"}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-ink truncate group-hover:text-yellow transition-colors">
                    {r.title}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mt-1">
                    /{r.slug}
                  </div>
                </div>
                <time className="flex-none font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                  {new Date(r.updatedAt).toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  })}
                </time>
                <span className="flex-none font-mono text-[10px] uppercase tracking-widest text-yellow opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
