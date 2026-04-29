import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { desc, isNotNull } from "drizzle-orm";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { db } from "@/lib/db/client";
import { news } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "News",
  description: "Tutte le news dalla pista RcLandia.",
};

export const dynamic = "force-dynamic";

export default async function NewsPage() {
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
    .orderBy(desc(news.publishedAt));

  return (
    <>
      <PageHero
        index="05"
        label="News"
        title="Dal"
        accent="box."
        color="yellow"
        subtitle="Ultime gare, aggiornamenti pista, racconti dal paddock. Il cronometro parla, ma anche il box ha cose da dire."
      />

      <section className="relative py-16 md:py-24 bg-bg">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          {posts.length === 0 ? (
            <div className="relative border border-white/10 bg-bg-elev px-6 py-20 md:px-12 md:py-28 overflow-hidden">
              <div className="absolute -top-12 -right-8 text-display text-[10rem] md:text-[18rem] leading-none text-yellow/5 select-none pointer-events-none">
                ON AIR
              </div>
              <div className="relative max-w-2xl mx-auto text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow mb-4">
                  Box silenzioso · Per ora
                </div>
                <h2 className="text-display text-[clamp(2rem,5vw,4rem)] leading-tight mb-5">
                  Le storie stanno{" "}
                  <span className="text-yellow">scaldando le gomme.</span>
                </h2>
                <p className="text-ink-dim text-base md:text-lg leading-relaxed">
                  Ancora niente cronaca da raccontare, ma la pista non dorme
                  mai. Le prime news arrivano direttamente dal paddock —
                  ripassa fra qualche giorno.
                </p>
                <Link
                  href="/eventi"
                  className="mt-8 inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-yellow hover:text-yellow-hot"
                >
                  Intanto, guarda il calendario <span>→</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-white/10 border-y border-white/10">
              {posts.map((p) => (
                <Reveal key={p.slug}>
                  <Link
                    href={`/news/${p.slug}`}
                    className="group grid grid-cols-12 gap-4 md:gap-6 py-8 md:py-12 items-start hover:bg-bg-elev transition-colors px-2 md:px-4"
                  >
                    <div className="col-span-12 md:col-span-2">
                      <time className="font-mono text-xs text-ink-dim">
                        {p.publishedAt
                          ? new Date(p.publishedAt).toLocaleDateString(
                              "it-IT",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              },
                            )
                          : "—"}
                      </time>
                    </div>
                    {p.coverImage ? (
                      <div className="col-span-12 md:col-span-3 relative aspect-[16/10] overflow-hidden bg-bg-elev border border-white/5">
                        <Image
                          src={p.coverImage}
                          alt={p.title}
                          fill
                          sizes="(min-width: 768px) 25vw, 100vw"
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                      </div>
                    ) : null}
                    <div
                      className={
                        p.coverImage
                          ? "col-span-12 md:col-span-5"
                          : "col-span-12 md:col-span-8"
                      }
                    >
                      <h2 className="text-display text-3xl md:text-5xl leading-tight group-hover:text-yellow transition-colors">
                        {p.title}
                      </h2>
                      <p className="mt-3 text-ink-dim leading-relaxed max-w-2xl">
                        {p.excerpt}
                      </p>
                    </div>
                    <div className="col-span-12 md:col-span-2 flex md:justify-end items-center gap-2 text-xs font-mono uppercase tracking-widest text-yellow opacity-70 group-hover:opacity-100 transition-opacity">
                      Leggi <span>→</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
