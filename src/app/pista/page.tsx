import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pista RcLandia",
  description:
    "RcLandia, pista RC indoor del Team La Gang. Info, orari, regolamento, tesseramento.",
};

const rules = [
  {
    n: "01",
    t: "Tesseramento obbligatorio",
    d: "Per girare in pista serve la tessera annuale dell'associazione. Copre assicurazione e accesso.",
  },
  {
    n: "02",
    t: "Sicurezza prima di tutto",
    d: "Frequenze controllate, binding verificato, nessuna auto in pista senza conferma del direttore di gara.",
  },
  {
    n: "03",
    t: "Rispetto della struttura",
    d: "Box puliti, batterie cariche in zona dedicata, no liquidi vicino all'elettronica.",
  },
  {
    n: "04",
    t: "Fair play",
    d: "Doppiaggi puliti, segnalazioni con luci, zero contatti volontari. La Gang non perdona.",
  },
];

const features = [
  { k: "Superficie", v: "Moquette, tracciato permanente" },
  { k: "Dimensione", v: "1000 m² circa · 3 aree box" },
  { k: "Categorie", v: "1/10 Touring, 1/10 FWD, 1/12 GT, 1/12 Pancar, TT02" },
  { k: "Illuminazione", v: "LED uniformi 5000K" },
  { k: "Box piloti", v: "Postazioni multiple + zona carica" },
  { k: "Cronometraggio", v: "AMB / MyLaps ready" },
];

export default function PistaPage() {
  return (
    <>
      <PageHero
        index="01"
        label="La pista"
        title="RcLandia"
        accent="è casa."
        subtitle="Indoor, moquette, aperta al pubblico tesserato. Il posto dove ci si ritrova tra amici per guidare, gareggiare o semplicemente divertirsi."
      />

      <section className="relative py-20 md:py-32 bg-bg-soft">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Reveal>
              <div className="relative w-full aspect-[4/3] bg-blue overflow-hidden">
                <Image
                  src="/rclandia-logo.png"
                  alt="RcLandia"
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-contain p-8"
                />
              </div>
            </Reveal>
          </div>
          <div className="md:col-span-7">
            <Reveal>
              <h2 className="text-display text-4xl md:text-6xl leading-[0.95]">
                Specifiche <span className="text-yellow">tecniche.</span>
              </h2>
            </Reveal>
            <div className="mt-8 divide-y divide-white/10">
              {features.map((f) => (
                <Reveal key={f.k}>
                  <div className="grid grid-cols-[140px_1fr] md:grid-cols-[200px_1fr] gap-4 py-5">
                    <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">
                      {f.k}
                    </span>
                    <span className="text-ink">{f.v}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="relative py-20 md:py-32 bg-bg">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
              02 · Regolamento
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.9]">
              Le regole della <span className="text-red">pista.</span>
            </h2>
          </Reveal>

          <div className="mt-12 md:mt-20 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {rules.map((r) => (
              <Reveal key={r.n}>
                <div className="group relative p-8 bg-bg-elev border border-white/10 hover:border-yellow transition-colors">
                  <div className="flex items-baseline gap-6">
                    <span className="text-display text-6xl text-yellow/40 group-hover:text-yellow transition-colors">
                      {r.n}
                    </span>
                    <div>
                      <h3 className="text-display text-2xl md:text-3xl">
                        {r.t}
                      </h3>
                      <p className="mt-3 text-ink-dim leading-relaxed">
                        {r.d}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-16 flex flex-wrap gap-4">
              <Link
                href="/contatti"
                data-cursor="iscriviti"
                className="inline-flex items-center gap-3 px-6 py-3 bg-yellow text-bg font-mono text-xs uppercase tracking-widest font-semibold"
              >
                Tesseramento <span>→</span>
              </Link>
              <Link
                href="/contatti"
                data-cursor="info"
                className="inline-flex items-center gap-3 px-6 py-3 border border-white/30 font-mono text-xs uppercase tracking-widest hover:border-yellow hover:text-yellow transition-colors"
              >
                Come raggiungerci
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
