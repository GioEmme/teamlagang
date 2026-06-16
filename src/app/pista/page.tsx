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

type Scope = "Sempre" | "In gara";

const rules: { n: string; t: string; d: string; scope: Scope }[] = [
  {
    n: "01",
    t: "Affiliazione ACI",
    scope: "Sempre",
    d: "Siamo un'associazione affiliata ACI: standard riconosciuti, copertura assicurativa e un regolamento ufficiale di riferimento per tutto ciò che non è specificato qui.",
  },
  {
    n: "02",
    t: "Sicurezza batterie",
    scope: "Sempre",
    d: "Le batterie LiPo vanno gestite con attenzione. In impianto si carica e scarica a massimo 10 A e sempre dentro al liposack: regole obbligatorie per la sicurezza di tutti, valide in gara e nelle giornate libere.",
  },
  {
    n: "03",
    t: "Rispetto della struttura",
    scope: "Sempre",
    d: "RcLandia va rispettata come ogni spazio condiviso. Box puliti, modi educati, nessuna provocazione: accorgimenti semplici che tengono l'ambiente piacevole per tutti, ogni giorno della settimana. Ingiurie o comportamenti che disturbano la manifestazione comportano l'esclusione e, se necessario, l'allontanamento dalla struttura.",
  },
  {
    n: "04",
    t: "Verifica tecnica",
    scope: "In gara",
    d: "Prima di ogni sessione di gara c'è una rapida verifica al banco: serve a garantire che tutti corrano alle stesse condizioni. I giudici verificatori hanno l'ultima parola sulle eventuali irregolarità.",
  },
  {
    n: "05",
    t: "Carrozzerie e decal",
    scope: "In gara",
    d: "Carrozzeria verniciata, decal di fari e calandre montate, vetri trasparenti per il controllo interno: sono requisiti obbligatori per gareggiare. I modelli che non li rispettano non prendono il via.",
  },
  {
    n: "06",
    t: "Palco e recuperi",
    scope: "In gara",
    d: "Una volta saliti sul palco si resta fino al termine della manche, anche con l'auto ferma, per non interferire con chi sta correndo. I recuperi spettano ai piloti della manche appena conclusa; se non puoi, delega un altro iscritto. Chi scende dal palco prima della fine o non è in postazione di recupero perde la qualifica/finale migliore disputata.",
  },
  {
    n: "07",
    t: "Pista in gara",
    scope: "In gara",
    d: "Durante le sessioni in pista entrano solo giuria e addetti ai recuperi. In gara i piloti più lenti agevolano i più veloci, senza ostacolare chi sta sopraggiungendo.",
  },
  {
    n: "08",
    t: "Iscrizione e giuria",
    scope: "In gara",
    d: "Iscriversi a una gara significa accettarne il regolamento: una base comune per tutti. Le decisioni della giuria sono definitive e servono a far svolgere le gare in modo ordinato.",
  },
];

const features = [
  { k: "Superficie", v: "Moquette permanente" },
  { k: "Dimensione", v: "1000 m² · 3 aree box" },
  { k: "Ambiente", v: "Indoor" },
  { k: "Accesso", v: "Previo tesseramento + rispetto regolamento" },
  { k: "Fondazione", v: "2010 · Team La Gang" },
  {
    k: "Categorie",
    v: "Modificata · Stock 17.5 · GT/LMH · FWD · Vaschetta · Pancar 1/12 · GT12 & LMH",
  },
];

const schedule = [
  { day: "Mercoledì", tag: "Serale", hours: "20:00 — 24:00" },
  { day: "Sabato", tag: "Giornata piena", hours: "09:00 — 19:00" },
  { day: "Domenica", tag: "Giornata piena", hours: "09:00 — 19:00" },
];

export default function PistaPage() {
  return (
    <>
      <PageHero
        index="01"
        label="La pista"
        title="Benvenuti"
        accent="in pista."
        bgImage="/pista.jpg"
        subtitle="Pista indoor in moquette, tracciato permanente, 1000 m² su tre aree box. Aperta al pubblico tesserato: il posto dove ci si ritrova tra amici per guidare, gareggiare o semplicemente divertirsi."
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

      <section className="relative py-20 md:py-28 bg-bg">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
              02 · Orari di apertura
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.9]">
              Quando siamo <span className="text-yellow">aperti.</span>
            </h2>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {schedule.map((s) => (
              <Reveal key={s.day}>
                <div className="group relative bg-bg-elev border border-yellow/30 hover:border-yellow transition-colors p-6 md:p-8 overflow-hidden">
                  <div className="absolute top-0 right-0 w-16 h-16 border-l border-b border-yellow/20" />
                  <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow/70 mb-3">
                    {s.tag}
                  </div>
                  <div className="text-display text-4xl md:text-5xl text-ink leading-none mb-6">
                    {s.day}
                  </div>
                  <div className="text-display text-3xl md:text-4xl text-yellow leading-none">
                    {s.hours}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <p className="mt-8 text-sm text-ink-faint font-mono uppercase tracking-widest">
              Stagione 2026/27 · giornate speciali e variazioni nelle news.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative py-20 md:py-32 bg-bg-soft">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
              03 · Regolamento sportivo
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.9]">
              Le regole della <span className="text-red">pista.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-ink-dim leading-relaxed max-w-2xl">
              Questo è il regolamento sportivo che applichiamo durante le gare.
              Alcuni punti — sicurezza, rispetto della struttura, copertura ACI
              — valgono comunque ogni giorno che si mette piede in pista, anche
              nelle giornate libere. Le card lo segnalano in alto a destra.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mt-4 font-mono text-xs uppercase tracking-widest text-ink-faint">
              Estratto · Regolamento Sportivo RcLandia · Rev. 01.00.25
            </p>
          </Reveal>

          <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {rules.map((r) => {
              const always = r.scope === "Sempre";
              return (
                <Reveal key={r.n}>
                  <div className="group relative p-8 bg-bg-elev border border-white/10 hover:border-yellow transition-colors h-full">
                    <span
                      className={`absolute top-4 right-4 font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border ${
                        always
                          ? "text-yellow border-yellow/40 bg-yellow/5"
                          : "text-ink-faint border-white/15"
                      }`}
                    >
                      {r.scope}
                    </span>
                    <div className="flex items-baseline gap-6">
                      <span className="text-display text-6xl text-yellow/40 group-hover:text-yellow transition-colors">
                        {r.n}
                      </span>
                      <div>
                        <h3 className="text-display text-2xl md:text-3xl pr-20">
                          {r.t}
                        </h3>
                        <p className="mt-3 text-ink-dim leading-relaxed">
                          {r.d}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-16 flex flex-wrap gap-4">
              <Link
                href="/stagione-2026-2027"
                data-cursor="stagione"
                className="inline-flex items-center gap-3 px-6 py-3 bg-yellow text-bg font-mono text-xs uppercase tracking-widest font-semibold"
              >
                Stagione 2026/27 · costi gara <span>→</span>
              </Link>
              <Link
                href="/tesseramento"
                data-cursor="iscriviti"
                className="inline-flex items-center gap-3 px-6 py-3 border border-white/30 font-mono text-xs uppercase tracking-widest hover:border-yellow hover:text-yellow transition-colors"
              >
                Tesseramento
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
