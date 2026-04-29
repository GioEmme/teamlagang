import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "Tesseramento e accessi",
  description:
    "Tessera annuale 20€, accessi giornalieri 20€ o mezza giornata 12€. Regole chiare, costi onesti, pista aperta da settembre a giugno a RcLandia.",
};

const benefits = [
  {
    n: "01",
    t: "Pista a tua disposizione",
    d: "Moquette sempre \"calda\" e pista sempre pronta! La pista è tua tutto il giorno: imposta il setup con calma, gira finché ne hai voglia, torna a casa solo quando l'auto è perfetta.",
  },
  {
    n: "02",
    t: "Postazioni dedicate",
    d: "Tre aree box organizzate, un tavolo pilota per ogni postazione: monti, smonti, carichi al tuo tavolo, tutto a portata di mano. Niente spazi di fortuna, niente lavorare in piedi su una sedia.",
  },
  {
    n: "03",
    t: "Cronometraggio professionale",
    d: "Sistema di cronometraggio sempre attivo durante le sessioni libere. Vedi i tuoi tempi, confronta i giri, capisci dove migliorare. Non è solo girare, è capire cosa fare diversamente al prossimo passaggio.",
  },
  {
    n: "04",
    t: "Una community vera",
    d: "Non sei solo. Trovi sempre qualcuno disponibile a darti una mano per setup, riparazioni, consigli. La Gang è quella roba lì: rivali in pista, amici tra una manche e l'altra.",
  },
];

const steps = [
  {
    n: "01",
    t: "Vieni a trovarci",
    d: "Mercoledì sera o nel weekend. Senza appuntamento.",
  },
  {
    n: "02",
    t: "Ci conosciamo",
    d: "Un giro di pista, un caffè, e ti spieghiamo come funziona.",
  },
  {
    n: "03",
    t: "Si parte",
    d: "Tessera, primo accesso, e da quel momento è anche casa tua.",
  },
];

export default function TesseramentoPage() {
  return (
    <>
      <PageHero
        index="07"
        label="Tesseramento"
        title="Una tessera,"
        accent="tutta la pista."
        color="yellow"
        subtitle="Per correre, anche solo per divertimento, basta poco. Una tessera annuale, costi onesti, regole chiare. Niente sorprese — solo pista, box e tempo da limare."
      />

      {/* ---------- Pricing cards ---------- */}
      <section className="relative py-20 md:py-32 bg-bg-soft">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
              Quanto costa
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.9] mb-12 md:mb-20">
              Trasparente
              <br />
              come una <span className="text-yellow">linea di gara.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {/* Tessera annuale — featured */}
            <Reveal>
              <div className="relative group bg-bg border-2 border-yellow p-8 md:p-10 h-full flex flex-col overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow text-bg font-mono text-[10px] uppercase tracking-widest px-3 py-1.5">
                  Obbligatoria
                </div>
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-yellow mb-4 mt-4 md:mt-6">
                  Tessera annuale
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-display text-7xl md:text-8xl text-ink leading-none">
                    20
                  </span>
                  <span className="text-display text-3xl md:text-4xl text-yellow leading-none">
                    €
                  </span>
                </div>
                <div className="font-mono text-xs uppercase tracking-widest text-ink-dim mb-6">
                  per anno
                </div>
                <ul className="flex flex-col gap-3 text-sm text-ink-dim leading-relaxed flex-1">
                  <Bullet>
                    Validità <span className="text-ink">12 mesi</span> dalla
                    data di emissione
                  </Bullet>
                  <Bullet>
                    Nominativa, non cedibile
                  </Bullet>
                  <Bullet>
                    Dà diritto di <span className="text-ink">accedere</span> e
                    utilizzare i servizi della struttura
                  </Bullet>
                  <Bullet>
                    Dà diritto di <span className="text-ink">girare in pista</span>{" "}
                    nel rispetto dei regolamenti
                  </Bullet>
                </ul>
              </div>
            </Reveal>

            {/* Accesso giornata intera */}
            <Reveal delay={0.05}>
              <div className="relative group bg-bg-elev border border-white/10 hover:border-yellow/50 transition-colors p-8 md:p-10 h-full flex flex-col">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint mb-4">
                  Accesso · giornata intera
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-display text-7xl md:text-8xl text-ink leading-none">
                    20
                  </span>
                  <span className="text-display text-3xl md:text-4xl text-ink-dim leading-none">
                    €
                  </span>
                </div>
                <div className="font-mono text-xs uppercase tracking-widest text-ink-dim mb-6">
                  per visita
                </div>
                <ul className="flex flex-col gap-3 text-sm text-ink-dim leading-relaxed flex-1">
                  <Bullet>
                    <span className="text-ink">Tutta la giornata</span> in pista
                    e nei box
                  </Bullet>
                  <Bullet>
                    Solo per le aperture intere:{" "}
                    <span className="text-ink">sabato e domenica</span> · 09:00
                    — 19:00
                  </Bullet>
                  <Bullet>
                    Stesso accesso, stesse regole, tutto il tempo per girare
                  </Bullet>
                </ul>
              </div>
            </Reveal>

            {/* Mezza giornata */}
            <Reveal delay={0.1}>
              <div className="relative group bg-bg-elev border border-white/10 hover:border-yellow/50 transition-colors p-8 md:p-10 h-full flex flex-col">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint mb-4">
                  Accesso · mezza giornata
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-display text-7xl md:text-8xl text-ink leading-none">
                    12
                  </span>
                  <span className="text-display text-3xl md:text-4xl text-ink-dim leading-none">
                    €
                  </span>
                </div>
                <div className="font-mono text-xs uppercase tracking-widest text-ink-dim mb-6">
                  per visita
                </div>
                <ul className="flex flex-col gap-3 text-sm text-ink-dim leading-relaxed flex-1">
                  <Bullet>
                    <span className="text-ink">Mercoledì sera</span> · 20:00 —
                    24:00 (è già di per sé mezza giornata)
                  </Bullet>
                  <Bullet>
                    Oppure quando nel weekend ti fermi solo poche ore
                  </Bullet>
                  <Bullet>
                    Pista, box e servizi come la giornata intera
                  </Bullet>
                </ul>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.15}>
            <p className="mt-8 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
              La tessera è obbligatoria · gli accessi si pagano alla giornata,
              non c'è abbonamento.
            </p>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="mt-12 md:mt-16 border border-yellow/30 bg-yellow/5 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow flex-none mt-1">
                  ☀ Pausa estiva
                </span>
                <p className="text-sm md:text-base text-ink-dim leading-relaxed">
                  La pista è aperta{" "}
                  <span className="text-ink">da settembre a giugno</span>.
                  Luglio e agosto restiamo chiusi al pubblico — non perché siamo
                  in ferie, anzi: è il momento in cui il direttivo si rimbocca
                  le maniche il doppio. Manutenzione pista, moquette,
                  illuminazione, qualche miglioria tenuta nascosta fino a
                  settembre. Quando si riapre, ti accoglie una pista riposata
                  e — di solito — qualche sorpresa.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- What you get ---------- */}
      <section className="relative py-20 md:py-32 bg-bg">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
              Cosa ti porti a casa
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.9] mb-12 md:mb-20">
              Più di una <span className="text-red">tessera.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {benefits.map((b) => (
              <Reveal key={b.n}>
                <div className="group relative p-8 bg-bg-elev border border-white/10 hover:border-yellow transition-colors h-full">
                  <div className="flex items-baseline gap-6">
                    <span className="text-display text-6xl text-yellow/40 group-hover:text-yellow transition-colors">
                      {b.n}
                    </span>
                    <div>
                      <h3 className="text-display text-2xl md:text-3xl">
                        {b.t}
                      </h3>
                      <p className="mt-3 text-ink-dim leading-relaxed">{b.d}</p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- How to ---------- */}
      <section className="relative py-20 md:py-32 bg-bg-soft">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
              Come si fa
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.9] mb-12 md:mb-16">
              Tre passi e <span className="text-yellow">si parte.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {steps.map((s) => (
              <Reveal key={s.n}>
                <div className="relative bg-bg border border-yellow/30 p-6 md:p-8 h-full">
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow mb-4">
                    Step {s.n}
                  </div>
                  <h3 className="text-display text-3xl md:text-4xl text-ink leading-tight mb-3">
                    {s.t}
                  </h3>
                  <p className="text-sm text-ink-dim leading-relaxed">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------- CTA ---------- */}
      <section className="relative py-20 md:py-32 bg-yellow text-bg overflow-hidden">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-end">
            <div className="md:col-span-8">
              <Reveal>
                <div className="font-mono text-xs uppercase tracking-[0.3em] text-bg/70 mb-4">
                  Pronti a partire?
                </div>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="text-display text-[clamp(2.5rem,8vw,8rem)] leading-[0.85]">
                  Una mail,
                  <br />
                  e sei dei <span className="text-bg/30">nostri.</span>
                </h2>
              </Reveal>
            </div>
            <div className="md:col-span-4 md:text-right">
              <Reveal delay={0.1}>
                <div className="flex flex-wrap md:justify-end gap-3">
                  <Link
                    href="/contatti"
                    data-cursor="vai"
                    className="inline-flex items-center gap-3 px-6 py-3 bg-bg text-yellow font-mono text-xs uppercase tracking-widest font-semibold hover:bg-bg-elev transition-colors"
                  >
                    Scrivici <span>→</span>
                  </Link>
                  <a
                    href="mailto:info@teamlagang.it"
                    data-cursor="vai"
                    className="inline-flex items-center gap-3 px-6 py-3 border-2 border-bg text-bg font-mono text-xs uppercase tracking-widest font-semibold hover:bg-bg hover:text-yellow transition-colors"
                  >
                    info@teamlagang.it
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-3">
      <span className="mt-2 w-1.5 h-1.5 rounded-full bg-yellow flex-none" />
      <span>{children}</span>
    </li>
  );
}
