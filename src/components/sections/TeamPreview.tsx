"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

const pilots = [
  { num: "01", name: "Alberto", role: "Il Presidente", cat: "1/12 GT", bio: "...non serve aggiungere altro." },
  { num: "02", name: "Isacco", role: "Il Vice", cat: "", bio: "Braccio destro del presidente e Direttore Gara ACI del team." },
  { num: "03", name: "Alberto", role: "Il Tesoriere", cat: "", bio: "L'economo del gruppo." },
  { num: "04", name: "Roberto", role: "Il Segretario", cat: "", bio: "Lui controlla e verbalizza... verbalizza e controlla." },
  { num: "05", name: "Alessandro", role: "Il Creativo", cat: "FWD", bio: "Chi sale sul podio avrà una sua opera tra le mani!" },
  { num: "06", name: "Andrea", role: "Lui sa chi chiamare...", cat: "Stock", bio: "Serve qualcuno? Lui sa indirizzarti dalla persona giusta!" },
  { num: "07", name: "Alessandro", role: "Il Verificatore", cat: "", bio: "A lui non scappa niente, quindi attenzione al banco controlli!" },
  { num: "08", name: "Danilo", role: "Il Saggio", cat: "1/10 GT", bio: "La voce saggia del gruppo, l'esperienza degli anni." },
  { num: "09", name: "Giovanni", role: "L'ultimo arrivato... anche in gara!", cat: "1/12 GT", bio: "Sul setup ha ancora tanto da imparare." },
];

export function TeamPreview({
  images = {},
}: {
  images?: Record<string, string>;
}) {
  return (
    <section className="relative py-24 md:py-40 bg-bg overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 md:mb-20">
          <div>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-3">
              04 · Team
            </div>
            <h2 className="text-display text-[clamp(2.4rem,6vw,6rem)] leading-[0.9]">
              I piloti della
              <br />
              <span className="text-red">Gang.</span>
            </h2>
          </div>
          <Link
            href="/team"
            data-cursor="team"
            className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-yellow hover:text-yellow-hot"
          >
            Tutti i piloti <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {pilots.map((p, i) => {
            const img = images[p.num];
            return (
            <motion.div
              key={p.num}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.9,
                delay: i * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative aspect-[3/4] bg-bg-elev border border-white/10 overflow-hidden"
              data-cursor={p.num}
            >
              {img && (
                <div className="absolute inset-0">
                  <Image
                    src={img}
                    alt={p.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/40 to-transparent" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-br from-red/20 via-transparent to-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              {!img && (
                <div className="absolute inset-0 flex items-center justify-center text-display text-[12rem] text-white/5 group-hover:text-yellow/20 transition-colors duration-700">
                  {p.num}
                </div>
              )}
              <div className="absolute inset-x-5 bottom-5">
                <div className="text-xs font-mono uppercase tracking-widest text-yellow">
                  #{p.num}
                </div>
                <div className="text-display text-2xl mt-1">{p.name}</div>
                <div className="text-xs text-ink-dim mt-1">{p.role}</div>
              </div>
              <div className="absolute inset-0 border border-yellow scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500" />
            </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
