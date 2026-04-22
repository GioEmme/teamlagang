import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Eventi",
  description: "Calendario gare e trofei alla pista RcLandia.",
};

const upcoming = [
  { date: "2026-05-10", name: "Trofeo di primavera · R3", cat: "1/10 Touring GT", status: "Iscrizioni aperte" },
  { date: "2026-05-24", name: "Monomarca TT02 · Round 4", cat: "TT02", status: "Iscrizioni aperte" },
  { date: "2026-06-07", name: "Pancar Nostalgia", cat: "1/12 Pancar", status: "Save the date" },
  { date: "2026-06-21", name: "Stock Open Day", cat: "1/10 Touring Stock", status: "In programmazione" },
];

const past = [
  { date: "2026-04-12", name: "Trofeo di primavera · R2", cat: "1/10 Touring GT", winner: "Pilota 01" },
  { date: "2026-03-29", name: "Monomarca TT02 · Round 3", cat: "TT02", winner: "Pilota 04" },
  { date: "2026-03-15", name: "FWD Challenge", cat: "1/10 FWD", winner: "Pilota 05" },
];

export default function EventiPage() {
  return (
    <>
      <PageHero
        index="04"
        label="Eventi"
        title="Calendario"
        accent="2026."
        color="yellow"
        subtitle="Trofei, open day, gare monomarca. La stagione della Gang, aggiornata in tempo reale."
      />

      <section className="relative py-20 md:py-32 bg-bg-soft">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
              Prossimi appuntamenti
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.9] mb-12 md:mb-16">
              In <span className="text-yellow">arrivo.</span>
            </h2>
          </Reveal>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {upcoming.map((e) => (
              <Reveal key={e.name}>
                <div className="group grid grid-cols-12 gap-4 py-6 md:py-8 hover:bg-bg-elev transition-colors px-2 md:px-4">
                  <time className="col-span-12 md:col-span-2 font-mono text-sm text-yellow">
                    {new Date(e.date).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "long",
                    })}
                  </time>
                  <div className="col-span-12 md:col-span-5">
                    <div className="text-display text-2xl md:text-3xl group-hover:text-yellow transition-colors">
                      {e.name}
                    </div>
                  </div>
                  <div className="col-span-8 md:col-span-3 font-mono text-xs uppercase tracking-widest text-ink-dim self-center">
                    {e.cat}
                  </div>
                  <div className="col-span-4 md:col-span-2 text-right font-mono text-xs uppercase tracking-widest text-ink-dim self-center">
                    {e.status}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-32 bg-bg">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
              Archivio
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.9] mb-12 md:mb-16">
              Risultati <span className="text-red">recenti.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {past.map((e) => (
              <Reveal key={e.name}>
                <div className="relative p-6 md:p-8 bg-bg-elev border border-white/10">
                  <time className="font-mono text-xs text-ink-dim">
                    {new Date(e.date).toLocaleDateString("it-IT", {
                      day: "2-digit",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                  <h3 className="text-display text-2xl mt-3">{e.name}</h3>
                  <div className="text-xs font-mono uppercase tracking-widest text-ink-dim mt-2">
                    {e.cat}
                  </div>
                  <div className="mt-6 pt-6 border-t border-white/10">
                    <div className="text-[10px] font-mono uppercase tracking-widest text-yellow">
                      Vincitore
                    </div>
                    <div className="text-display text-xl mt-1">{e.winner}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
