import Image from "next/image";
import Link from "next/link";
import { desc, isNotNull } from "drizzle-orm";
import { Reveal } from "@/components/Reveal";
import { db } from "@/lib/db/client";
import { news } from "@/lib/db/schema";

export async function NewsPreview() {
  const posts = await db
    .select({
      slug: news.slug,
      title: news.title,
      excerpt: news.excerpt,
      coverImage: news.coverImage,
      publishedAt: news.publishedAt,
    })
    .from(news)
    .where(isNotNull(news.publishedAt))
    .orderBy(desc(news.publishedAt))
    .limit(3);

  if (posts.length === 0) return null;

  return (
    <section className="relative py-24 md:py-40 bg-bg-soft">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-20">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-3">
              05 · News
            </div>
            <h2 className="text-display text-[clamp(2.4rem,6vw,6rem)] leading-[0.9]">
              Ultime dal
              <br />
              <span className="text-yellow">box.</span>
            </h2>
          </div>
          <Link
            href="/news"
            data-cursor="archivio"
            className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-yellow hover:text-yellow-hot"
          >
            Archivio completo <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {posts.map((n, i) => (
            <Reveal key={n.slug} delay={i * 0.08}>
              <Link
                href={`/news/${n.slug}`}
                className="group relative bg-bg border border-white/10 hover:border-yellow transition-colors flex flex-col h-[340px] overflow-hidden"
              >
                <div className="relative w-full h-36 flex-none overflow-hidden bg-bg-elev">
                  {n.coverImage ? (
                    <>
                      <Image
                        src={n.coverImage}
                        alt={n.title}
                        fill
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg/40 to-transparent pointer-events-none" />
                    </>
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-bg-elev to-bg-soft">
                      <span className="text-display text-5xl md:text-6xl text-yellow/10 select-none tracking-wider">
                        NEWS
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-2 flex-1 p-5 min-h-0">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-yellow">
                      News
                    </span>
                    <time className="font-mono text-[10px] text-ink-faint">
                      {n.publishedAt
                        ? new Date(n.publishedAt).toLocaleDateString("it-IT", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        : ""}
                    </time>
                  </div>
                  <h3 className="text-display text-xl md:text-2xl leading-tight group-hover:text-yellow transition-colors line-clamp-2">
                    {n.title}
                  </h3>
                  <p className="text-ink-dim text-sm leading-relaxed flex-1 line-clamp-3">
                    {n.excerpt}
                  </p>
                  <div className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest text-yellow opacity-60 group-hover:opacity-100 transition-opacity">
                    Leggi <span>→</span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
