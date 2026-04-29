import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { getTeamImages } from "@/lib/teamImages";

export const metadata: Metadata = {
  title: "Team",
  description: "I piloti di A.S. Team La Gang.",
};

const pilots = [
  { num: "01", name: "Alberto", role: "Il Presidente", cat: "1/12 GT", bio: "...non serve aggiungere altro." },
  { num: "02", name: "Isacco", role: "Il Vice", cat: "", bio: "Braccio destro del presidente e Direttore Gara ACI del team." },
  { num: "03", name: "Alberto", role: "Il Tesoriere", cat: "", bio: "L'economo del gruppo." },
  { num: "04", name: "Roberto", role: "Il Segretario", cat: "", bio: "Lui controlla e verbalizza... verbalizza e controlla." },
  { num: "05", name: "Alessandro", role: "Il Creativo", cat: "FWD", bio: "Chi sale sul podio avrà una sua opera tra le mani!" },
  { num: "06", name: "Andrea", role: "Lui sa chi chiamare...", cat: "Stock", bio: "Serve qualcuno? Lui sa indirizzarti dalla persona giusta!" },
  { num: "07", name: "Alessandro", role: "Il Verificatore", cat: "", bio: "A lui non scappa niente, quindi attenzione al banco controlli!" },
  { num: "08", name: "Danilo", role: "Il Saggio", cat: "1/10 GT", bio: "La voce saggia del gruppo, l'esperienza degli anni." },
  { num: "09", name: "Enrico", role: "", cat: "1/10 GT", bio: "" },
  { num: "10", name: "Giovanni", role: "L'ultimo arrivato... anche in gara!", cat: "1/12 GT", bio: "Sul setup ha ancora tanto da imparare." },
];

export default function TeamPage() {
  const images = getTeamImages();
  return (
    <>
      <PageHero
        index="02"
        label="Team"
        title="La Gang"
        accent="al completo."
        color="red"
        subtitle="Il direttivo del Team La Gang: le persone che tengono viva RcLandia. Pista, gare, calendario, accoglienza — settimana dopo settimana, dietro le quinte e in prima linea."
      />

      <section className="relative py-20 md:py-32 bg-bg">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {pilots.map((p) => {
              const img = images[p.num];
              return (
              <Reveal key={p.num}>
                <article
                  data-cursor={`#${p.num}`}
                  className="group relative aspect-[4/5] bg-bg-elev border border-white/10 overflow-hidden"
                >
                  {img && (
                    <div className="absolute inset-0">
                      <Image
                        src={img}
                        alt={p.name}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/10" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-red/10 via-transparent to-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  {!img && (
                    <div className="absolute inset-0 flex items-center justify-center text-display text-[16rem] text-white/[0.04] group-hover:text-yellow/20 transition-colors duration-700 select-none">
                      {p.num}
                    </div>
                  )}
                  <div className="absolute inset-0 p-6 md:p-8 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-1 bg-yellow text-bg text-[10px] font-mono uppercase tracking-widest font-semibold">
                        {p.role}
                      </span>
                      <span className="font-mono text-xs uppercase tracking-widest text-ink-dim">
                        #{p.num}
                      </span>
                    </div>
                    <div>
                      <div className="text-display text-3xl md:text-4xl leading-tight group-hover:text-yellow transition-colors">
                        {p.name}
                      </div>
                      <div className="text-xs font-mono uppercase tracking-widest text-red mt-2">
                        {p.cat}
                      </div>
                      <p className="text-sm text-ink-dim mt-3 leading-relaxed">
                        {p.bio}
                      </p>
                    </div>
                  </div>
                </article>
              </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
