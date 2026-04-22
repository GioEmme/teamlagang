"use client";

import { motion } from "framer-motion";
import Link from "next/link";

const news = [
  {
    date: "2026-04-12",
    tag: "Gara",
    title: "Trofeo di primavera · classifica finale",
    excerpt:
      "Chiusa la tre giorni di 1/10 Touring GT. Podio tutto interno al Team La Gang.",
  },
  {
    date: "2026-04-05",
    tag: "Pista",
    title: "Nuova configurazione del tracciato",
    excerpt:
      "Due curve ridisegnate, chicane aggiunta in rettilineo. Briefing mercoledì sera.",
  },
  {
    date: "2026-03-22",
    tag: "Tesseramento",
    title: "Aperte le iscrizioni stagione 2026",
    excerpt:
      "Nuove agevolazioni per under 16 e rientro categorie 1/12 Pancar in calendario.",
  },
];

export function NewsPreview() {
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
          {news.map((n, i) => (
            <motion.article
              key={n.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.9,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative p-6 md:p-8 bg-bg border border-white/10 hover:border-yellow transition-colors flex flex-col gap-4 min-h-[320px]"
            >
              <div className="flex items-center justify-between">
                <span className="px-2 py-1 bg-yellow text-bg text-[10px] font-mono uppercase tracking-widest font-semibold">
                  {n.tag}
                </span>
                <time className="font-mono text-xs text-ink-faint">
                  {new Date(n.date).toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </time>
              </div>
              <h3 className="text-display text-2xl md:text-3xl leading-tight group-hover:text-yellow transition-colors">
                {n.title}
              </h3>
              <p className="text-ink-dim text-sm leading-relaxed flex-1">
                {n.excerpt}
              </p>
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-yellow opacity-60 group-hover:opacity-100 transition-opacity">
                Leggi <span>→</span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
