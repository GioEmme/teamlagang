import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { getTeamImages } from "@/lib/teamImages";

export const metadata: Metadata = {
  title: "Team",
  description: "Team La Gang e RcLandia sono una cosa sola: il team dietro la pista RC indoor di Scandiano.",
};

const pilots = [
  { num: "01", name: "Alberto", surname: "Montecchi" },
  { num: "02", name: "Isacco", surname: "Fornaciari" },
  { num: "03", name: "Alberto", surname: "Spadoni" },
  { num: "04", name: "Roberto", surname: "Petazzoni" },
  { num: "05", name: "Alessandro", surname: "Davoli" },
  { num: "06", name: "Andrea", surname: "Retrivi" },
  { num: "07", name: "Alessandro", surname: "Lonardi" },
  { num: "08", name: "Danilo", surname: "Donadelli" },
  { num: "09", name: "Enrico", surname: "Rabitti" },
  { num: "10", name: "Giovanni", surname: "Mauramati" },
];

export default function TeamPage() {
  const images = getTeamImages();
  return (
    <>
      <PageHero
        index="02"
        label="Team"
        title="Il"
        accent="team."
        color="red"
        subtitle="Team La Gang e RcLandia sono una cosa sola: non c'è pista senza il team, non c'è team senza la pista. Le persone dietro gare, calendario e accoglienza, settimana dopo settimana."
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
                    <div className="flex justify-end items-start">
                      <span className="font-mono text-xs uppercase tracking-widest text-ink-dim">
                        #{p.num}
                      </span>
                    </div>
                    <div>
                      <div className="text-display text-3xl md:text-4xl leading-[0.95] group-hover:text-yellow transition-colors">
                        {p.name}
                        <br />
                        {p.surname}
                      </div>
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
