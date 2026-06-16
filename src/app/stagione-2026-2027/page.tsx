import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Stagione 2026/27",
  description:
    "Italian Indoor Series 2026/27 a RcLandia: calendario ufficiale, regolamento sportivo, svolgimento gara, punteggio, costi di iscrizione e modalità di pagamento.",
};

// ----- Punteggio Finale A / B / C (regolamento sportivo 2026/27) -----
const POINTS: { a: [number, number]; b: [number, number]; c: [number, number] }[] = [
  { a: [1, 83], b: [11, 42], c: [21, 11] },
  { a: [2, 77], b: [12, 39], c: [22, 10] },
  { a: [3, 72], b: [13, 36], c: [23, 9] },
  { a: [4, 68], b: [14, 33], c: [24, 8] },
  { a: [5, 64], b: [15, 30], c: [25, 7] },
  { a: [6, 60], b: [16, 27], c: [26, 6] },
  { a: [7, 56], b: [17, 24], c: [27, 5] },
  { a: [8, 52], b: [18, 21], c: [28, 4] },
  { a: [9, 48], b: [19, 18], c: [29, 3] },
  { a: [10, 44], b: [20, 15], c: [30, 2] },
];

const FORMAT = [
  {
    n: "01",
    t: "Prova cronometrata",
    d: "Una sola prova cronometrata. Conta la somma dei migliori 3 giri consecutivi. Durata: 5 minuti per tutte le categorie.",
  },
  {
    n: "02",
    t: "Qualifiche",
    d: "Tre qualifiche per categoria. Vale il miglior risultato in termini di giri/tempo (non la somma): un solo turno perfetto basta per partire davanti.",
  },
  {
    n: "03",
    t: "Finali",
    d: "Tre finali di gara A/B/C… a punteggio, con 1 scarto. La pole sceglie per prima la posizione sul palco, a scalare gli altri.",
  },
];

const BATTERY = [
  { cat: "Prova cronometrata · tutte le categorie", min: "5 min" },
  { cat: "Pan car 1/12", min: "8 min" },
  { cat: "GT12 / LMH", min: "6 min" },
  { cat: "Touring Stock · Modificata · FWD · GT/LMH · Vaschetta", min: "5 min" },
];

// Documenti scaricabili. file = PDF locale in /public/regolamenti, href = link esterno.
const DOCUMENTS: {
  label: string;
  desc: string;
  file?: string;
  href?: string;
  meta: string;
  tag: string;
}[] = [
  {
    label: "Regolamento completo 2026/27",
    desc: "Il documento ufficiale integrale: calendario, regolamento sportivo, disciplinare e tecnico.",
    file: "/regolamenti/Regolamento-RcLandia-2026-2027.pdf",
    meta: "PDF · 0,6 MB",
    tag: "PDF",
  },
  {
    label: "EFRA — Lista carrozzerie 1/10",
    desc: "Carrozzerie omologate EFRA per le classi Touring 1/10 (Modificata, Stock, GT/LMH).",
    href: "https://www.efra.ws/wp-content/uploads/2026/03/2026_EFRA_List_Electric_Track.pdf",
    meta: "PDF · EFRA · 2026",
    tag: "EFRA",
  },
  {
    label: "EFRA — Lista carrozzerie 1/12",
    desc: "Carrozzerie omologate EFRA per le classi 1/12 (Pancar e GT12/LMH).",
    href: "https://www.efra.ws/wp-content/uploads/2026/03/2026_EFRA_List_1_12_Electric_Track.pdf",
    meta: "PDF · EFRA · 2026",
    tag: "EFRA",
  },
  {
    label: "EFRA — Liste motori omologati",
    desc: "Motori brushless omologati per turno (21.5, 17.5, 13.5, modified). Pagina ufficiale, sempre aggiornata.",
    href: "https://www.efra.ws/homologation/",
    meta: "Web · EFRA",
    tag: "EFRA",
  },
  {
    label: "ACI — Regolamentazione carrozzerie 2026",
    desc: "Lista carrozzerie ACI, usata per la categoria FWD (e LMGT3, LMH, Formula). PDF ufficiale dall'Annuario 2026.",
    href: "https://www.acisport.it/public_federazione/2026/pdf/Annuario/6_regolamentazione_carrozzerie_automodellismo_rc_-_2026.pdf",
    meta: "PDF · ACI · 2026",
    tag: "ACI",
  },
  {
    label: "ACI — Regolamenti automodellismo (Annuario 2026)",
    desc: "Norme generali e regolamenti di settore della disciplina, a cui rimanda il regolamento per i punti non specificati.",
    href: "https://www.acisport.it/it/acisport/normativa/annuario-sportivo/3-regolamenti-di-settore/68-automodellismo-dinamico/2026",
    meta: "Web · ACI Sport · Annuario",
    tag: "ACI",
  },
];

export default function Stagione2627Page() {
  const { season } = site;
  return (
    <>
      <PageHero
        index="IIS"
        label="Stagione 2026 / 27"
        title="Italian"
        accent="Indoor Series."
        subtitle="Cinque round on-road elettrico a RcLandia, da ottobre 2026 a marzo 2027. Qui trovi il calendario ufficiale, il regolamento sportivo, costi e pagamenti — tutto quello che serve per scendere in griglia."
      />

      {/* ---------- Colpo d'occhio ---------- */}
      <section className="relative py-16 md:py-24 bg-bg-soft">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <Stat k="Round" v={`${season.rounds}`} sub="prove in campionato" />
            <Stat k="Categorie" v={`${season.classes.length}`} sub="classi ammesse" />
            <Stat k="Validi" v="4 / 5" sub="migliori risultati" />
            <Stat k="Iscrizione" v={`${season.fees.oneClass}€`} sub="1 categoria" />
          </div>
        </div>
      </section>

      {/* ---------- Calendario ufficiale ---------- */}
      <section className="relative py-20 md:py-32 bg-bg">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
              01 · Calendario ufficiale {season.key}
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.9] mb-12 md:mb-16">
              Le date in <span className="text-yellow">griglia.</span>
            </h2>
          </Reveal>

          <div className="divide-y divide-white/10 border-y border-white/10">
            {season.calendar.map((e, i) => {
              const isIis = "iis" in e && e.iis;
              const round = "round" in e ? e.round : null;
              const note = "note" in e ? e.note : null;
              return (
                <Reveal key={i}>
                  <div className="grid grid-cols-12 gap-4 py-6 md:py-7 px-2 md:px-4 hover:bg-bg-elev transition-colors">
                    <div className="col-span-12 md:col-span-3 flex items-center gap-3">
                      <span
                        className={
                          "inline-flex items-center font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border " +
                          (isIis
                            ? "text-yellow border-yellow/40 bg-yellow/5"
                            : "text-ink-faint border-white/15 bg-white/[0.02]")
                        }
                      >
                        {isIis ? `Round ${round}` : "Trofeo"}
                      </span>
                    </div>
                    <time className="col-span-12 md:col-span-3 font-mono text-sm text-yellow self-center">
                      {e.date}
                    </time>
                    <div className="col-span-12 md:col-span-6 self-center">
                      <div className="text-display text-xl md:text-2xl leading-tight text-ink">
                        {e.title}
                      </div>
                      {note ? (
                        <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                          {note}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/eventi"
                data-cursor="vai"
                className="inline-flex items-center gap-3 px-6 py-3 bg-yellow text-bg font-mono text-xs uppercase tracking-widest font-semibold hover:bg-yellow-hot transition-colors"
              >
                Iscrizioni & classifiche live <span>→</span>
              </Link>
              <p className="font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                Iscrizioni online e classifiche aggiornate sulla pagina Eventi,
                sincronizzate da myrcm.ch.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Svolgimento gara ---------- */}
      <section className="relative py-20 md:py-32 bg-bg-soft">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
              02 · Svolgimento gara
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.9] mb-12 md:mb-16">
              Come si <span className="text-red">corre.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            {FORMAT.map((f) => (
              <Reveal key={f.n}>
                <div className="group relative p-8 bg-bg border border-white/10 hover:border-yellow transition-colors h-full">
                  <span className="text-display text-6xl text-yellow/40 group-hover:text-yellow transition-colors">
                    {f.n}
                  </span>
                  <h3 className="mt-4 text-display text-2xl md:text-3xl">{f.t}</h3>
                  <p className="mt-3 text-ink-dim leading-relaxed">{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Durata batterie */}
          <Reveal delay={0.1}>
            <div className="mt-12 border border-white/10 bg-bg p-6 md:p-8">
              <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow mb-5">
                Durata batterie · qualifiche e finali
              </div>
              <div className="divide-y divide-white/10">
                {BATTERY.map((b) => (
                  <div
                    key={b.cat}
                    className="grid grid-cols-[1fr_auto] gap-4 py-3 items-center"
                  >
                    <span className="text-sm text-ink-dim">{b.cat}</span>
                    <span className="font-display text-2xl text-ink">{b.min}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-sm text-ink-dim leading-relaxed">
              <li>
                <span className="text-ink">Minimo iscritti:</span> 6 per
                categoria. La finale B o C si svolge solo con almeno 6
                concorrenti.
              </li>
              <li>
                <span className="text-ink">Classifica finale:</span> validi i
                migliori 4 risultati sulle 5 prove disputate.
              </li>
              <li>
                <span className="text-ink">Parità di punti:</span> conta lo
                scarto (la partecipazione al campionato); a ulteriore parità, la
                migliore prestazione nelle gare disputate.
              </li>
              <li>
                <span className="text-ink">Verifiche tecniche:</span> prima di
                ogni qualifica o finale; modello non conforme = niente ingresso
                in pista o esclusione.
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------- Punteggio ---------- */}
      <section className="relative py-20 md:py-32 bg-bg">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
              03 · Punteggio per gara
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.9] mb-6">
              Ogni posizione, <span className="text-yellow">i suoi punti.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-ink-dim leading-relaxed max-w-2xl mb-10">
              Al termine di ogni gara viene stilata una classifica con il
              seguente punteggio, suddiviso per finale disputata.
            </p>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="border border-white/10 overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-bg-elev">
                  <tr className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                    <th className="px-4 py-3 text-left text-yellow">Finale A</th>
                    <th className="px-4 py-3 text-right">Pti</th>
                    <th className="px-4 py-3 text-left text-yellow border-l border-white/10">
                      Finale B
                    </th>
                    <th className="px-4 py-3 text-right">Pti</th>
                    <th className="px-4 py-3 text-left text-yellow border-l border-white/10">
                      Finale C
                    </th>
                    <th className="px-4 py-3 text-right">Pti</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-mono">
                  {POINTS.map((r, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-2.5 text-ink-dim">{r.a[0]}° class.</td>
                      <td className="px-4 py-2.5 text-right text-ink font-display text-lg">
                        {r.a[1]}
                      </td>
                      <td className="px-4 py-2.5 text-ink-dim border-l border-white/10">
                        {r.b[0]}° class.
                      </td>
                      <td className="px-4 py-2.5 text-right text-ink font-display text-lg">
                        {r.b[1]}
                      </td>
                      <td className="px-4 py-2.5 text-ink-dim border-l border-white/10">
                        {r.c[0]}° class.
                      </td>
                      <td className="px-4 py-2.5 text-right text-ink font-display text-lg">
                        {r.c[1]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
              Dal 31° classificato in poi: 1 punto.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ---------- Costi & iscrizione ---------- */}
      <section className="relative py-20 md:py-32 bg-bg-soft">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
              04 · Costi e iscrizione
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.9] mb-12 md:mb-16">
              Quanto costa <span className="text-yellow">il round.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Reveal>
              <div className="bg-bg border-2 border-yellow p-8 md:p-10 h-full flex flex-col">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-yellow mb-4">
                  1 categoria
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-display text-7xl md:text-8xl text-ink leading-none">
                    {season.fees.oneClass}
                  </span>
                  <span className="text-display text-3xl md:text-4xl text-yellow leading-none">
                    €
                  </span>
                </div>
                <div className="mt-2 font-mono text-xs uppercase tracking-widest text-ink-dim">
                  per round
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="bg-bg-elev border border-white/10 p-8 md:p-10 h-full flex flex-col">
                <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-ink-faint mb-4">
                  2 categorie
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-display text-7xl md:text-8xl text-ink leading-none">
                    {season.fees.twoClasses}
                  </span>
                  <span className="text-display text-3xl md:text-4xl text-ink-dim leading-none">
                    €
                  </span>
                </div>
                <div className="mt-2 font-mono text-xs uppercase tracking-widest text-ink-dim">
                  per round · massimo 2 categorie
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-6 border border-red/30 bg-red/5 p-6 md:p-8">
              <div className="flex items-start gap-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-red flex-none mt-1">
                  +{season.fees.lateSurcharge}€
                </span>
                <p className="text-sm md:text-base text-ink-dim leading-relaxed">
                  Si può pagare l'iscrizione anche il giorno della gara, ma con
                  una <span className="text-ink">maggiorazione di {season.fees.lateSurcharge}€</span>{" "}
                  sul prezzo. Per evitarla, salda entro e non oltre la domenica
                  precedente ogni round.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <ul className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-sm text-ink-dim leading-relaxed">
              <li>
                <span className="text-ink">Iscrizioni:</span> raccolte solo ed
                esclusivamente via MyRCM.
              </li>
              <li>
                <span className="text-ink">Conferma:</span> il pagamento della
                quota conferma l'iscrizione alla gara.
              </li>
              <li>
                <span className="text-ink">Limite:</span> non è ammesso
                iscriversi a più di due categorie per singolo round.
              </li>
              <li>
                <span className="text-ink">Impegno:</span> con l'iscrizione ogni
                concorrente accetta integralmente il regolamento.
              </li>
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ---------- Pagamenti ---------- */}
      <section className="relative py-20 md:py-32 bg-bg">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
              05 · Modalità di pagamento
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.9] mb-12 md:mb-16">
              Come si <span className="text-yellow">salda.</span>
            </h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <Reveal>
              <div className="bg-bg-elev border border-white/10 p-8 h-full">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow mb-4">
                  01 · PayPal
                </div>
                <p className="text-ink-dim leading-relaxed">
                  Trasferimento come{" "}
                  <span className="text-ink">amici e familiari</span> al seguente
                  indirizzo:
                </p>
                <a
                  href={`mailto:${season.paymentEmail}`}
                  data-cursor="vai"
                  className="mt-4 inline-block text-display text-2xl md:text-3xl text-yellow break-all hover:text-yellow-hot transition-colors"
                >
                  {season.paymentEmail}
                </a>
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <div className="bg-bg-elev border border-white/10 p-8 h-full">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow mb-4">
                  02 · In pista
                </div>
                <p className="text-ink-dim leading-relaxed">
                  Direttamente a <span className="text-ink">RC Landia</span>, di
                  persona. Ricorda: se paghi il giorno della gara scatta la
                  maggiorazione di {season.fees.lateSurcharge}€.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={0.1}>
            <div className="mt-12 flex flex-wrap gap-4">
              <Link
                href="/categorie"
                data-cursor="vai"
                className="inline-flex items-center gap-3 px-6 py-3 border border-white/30 font-mono text-xs uppercase tracking-widest hover:border-yellow hover:text-yellow transition-colors"
              >
                Regolamento tecnico · categorie <span>→</span>
              </Link>
              <Link
                href="/pista"
                data-cursor="vai"
                className="inline-flex items-center gap-3 px-6 py-3 border border-white/30 font-mono text-xs uppercase tracking-widest hover:border-yellow hover:text-yellow transition-colors"
              >
                Regolamento disciplinare <span>→</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ---------- Documenti ---------- */}
      <section className="relative py-20 md:py-32 bg-bg-soft">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
              06 · Documenti
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.9] mb-5">
              Scarica il <span className="text-yellow">regolamento.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-ink-dim leading-relaxed max-w-2xl mb-12 md:mb-16">
              Il regolamento ufficiale integrale e le liste tecniche a cui
              rimanda: carrozzerie e motori omologati EFRA, carrozzerie ACI. I
              link esterni aprono sempre le versioni ufficiali aggiornate.
            </p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {DOCUMENTS.map((d) => {
              const url = d.file ?? d.href ?? "#";
              const external = !d.file;
              return (
                <Reveal key={url}>
                  <a
                    href={url}
                    {...(d.file
                      ? { download: "" }
                      : { target: "_blank", rel: "noopener noreferrer" })}
                    data-cursor="scarica"
                    className="group flex items-start gap-5 bg-bg border border-white/10 hover:border-yellow transition-colors p-6 md:p-8 h-full"
                  >
                    <span className="flex-none mt-1 font-mono text-[10px] uppercase tracking-widest text-yellow border border-yellow/40 bg-yellow/5 px-2 py-1">
                      {d.tag}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-display text-xl md:text-2xl leading-tight group-hover:text-yellow transition-colors">
                        {d.label}
                      </div>
                      <p className="mt-2 text-sm text-ink-dim leading-relaxed">
                        {d.desc}
                      </p>
                      <div className="mt-3 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                        {d.meta}
                      </div>
                    </div>
                    <span className="flex-none self-center font-mono text-lg text-yellow opacity-60 group-hover:opacity-100 transition-opacity">
                      {external ? "→" : "↓"}
                    </span>
                  </a>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}

function Stat({ k, v, sub }: { k: string; v: string; sub: string }) {
  return (
    <Reveal>
      <div className="bg-bg border border-white/10 p-5 md:p-6 h-full">
        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-3">
          {k}
        </div>
        <div className="text-display text-4xl md:text-5xl text-yellow leading-none">
          {v}
        </div>
        <div className="mt-2 font-mono text-[11px] uppercase tracking-widest text-ink-dim">
          {sub}
        </div>
      </div>
    </Reveal>
  );
}
