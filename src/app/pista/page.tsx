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
    d: "Siamo un'associazione affiliata ACI: significa standard riconosciuti, copertura assicurativa solida e una bussola ufficiale a cui affidarsi per qualunque dettaglio non scritto in queste righe.",
  },
  {
    n: "02",
    t: "Sicurezza batterie",
    scope: "Sempre",
    d: "Le LiPo sono potenti e meritano rispetto. In impianto si carica e scarica a massimo 10 A e sempre dentro al liposack: regole non negoziabili, perché la sicurezza di tutti viene prima di qualsiasi cronometro. Vale per le gare e ovviamente anche nelle giornate libere.",
  },
  {
    n: "03",
    t: "Rispetto della struttura",
    scope: "Sempre",
    d: "RcLandia è casa nostra, e vogliamo che lo sia anche per chi viene a trovarci. Box puliti, modi educati, nessuna provocazione: tre piccoli accorgimenti che mantengono l'atmosfera che tutti cerchiamo quando si entra in pista, ogni giorno della settimana.",
  },
  {
    n: "04",
    t: "Verifica tecnica",
    scope: "In gara",
    d: "Prima di ogni sessione di gara una rapida verifica al banco: pochi secondi per garantire che tutti corrano alle stesse condizioni. I giudici verificatori sono lì per aiutarvi, e per loro natura hanno l'ultima parola sulle eventuali irregolarità.",
  },
  {
    n: "05",
    t: "Carrozzerie e decal",
    scope: "In gara",
    d: "Carrozzeria verniciata, decal di fari e calandre montate, vetri trasparenti per il controllo interno: piccoli dettagli che fanno la differenza tra un modello da gara e un giocattolo. È anche per questo che i nostri schieramenti sono belli da vedere.",
  },
  {
    n: "06",
    t: "Palco e recuperi",
    scope: "In gara",
    d: "Una volta saliti sul palco si resta fino al termine della manche, anche con l'auto ferma — è la base per non interferire con chi sta correndo. I recuperi spettano alla manche appena finita: un gesto di mutuo soccorso che fa girare bene la giornata. Se proprio non puoi, delega un altro iscritto.",
  },
  {
    n: "07",
    t: "Pista in gara",
    scope: "In gara",
    d: "Durante le sessioni in pista entrano solo giuria e addetti ai recuperi: meno gente in mezzo, più sicurezza per tutti. E in gara, chi sta tirando il decimo del giro va lasciato passare con stile — il fair play è sempre il sorpasso più bello.",
  },
  {
    n: "08",
    t: "Iscrizione e giuria",
    scope: "In gara",
    d: "Iscriversi a una gara significa anche accettare queste poche regole: niente di trascendentale, ma serve una base comune. Le decisioni della giuria sono definitive — non per imporre, ma per tenere le gare scorrevoli e tutti concentrati su quello che conta davvero: divertirsi correndo.",
  },
];

const features = [
  { k: "Superficie", v: "Moquette permanente" },
  { k: "Dimensione", v: "1000 m² · 3 aree box" },
  { k: "Ambiente", v: "Indoor" },
  { k: "Accesso", v: "Previo tesseramento + rispetto regolamento" },
  { k: "Fondazione", v: "2018" },
  {
    k: "Categorie",
    v: "Modificata · Stock 17.5 · GT · FWD · TT Club · Pancar 1/12 · GT12 & LMH",
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
        title="RcLandia"
        accent="è casa."
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
              Quando si <span className="text-yellow">gira.</span>
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
              Stagione 2025/26 · giornate speciali e variazioni nelle news.
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
              Il patto della <span className="text-red">pista.</span>
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
                href="/tesseramento"
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
