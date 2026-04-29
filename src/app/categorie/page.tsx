import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Categorie",
  description:
    "Le categorie RC di RcLandia: Touring 1/10 Modificata/Stock/GT, FWD, TT Club, Pancar 1/12 Open e GT12/LMH.",
};

const SPEC_LABELS: Record<keyof (typeof site.categories)[number]["specs"], string> = {
  scale: "Scala",
  drivetrain: "Trazione",
  motor: "Motore",
  esc: "Regolatore",
  ratio: "Rapporto",
  battery: "Batteria",
  body: "Carrozzeria",
  tires: "Gomme",
  weight: "Peso",
};

const SPEC_ORDER = [
  "scale",
  "drivetrain",
  "motor",
  "esc",
  "ratio",
  "battery",
  "body",
  "tires",
  "weight",
] as const;

export default function CategoriePage() {
  return (
    <>
      <PageHero
        index="03"
        label="Categorie"
        title="Sette"
        accent="discipline."
        subtitle="Dalla scuola TT Club alla modificata open. Dalla pura Pancar 1/12 al GT12. Ogni classe ha un suo linguaggio, un suo ritmo, un suo regolamento — qui trovi tutto."
      />

      <section className="relative pb-20 md:pb-32 bg-bg">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          {site.categories.map((c, i) => {
            const even = i % 2 === 0;
            const color = i % 3 === 0 ? "yellow" : i % 3 === 1 ? "red" : "blue";
            const colorClass =
              color === "yellow"
                ? "text-yellow"
                : color === "red"
                  ? "text-red"
                  : "text-blue";
            return (
              <article
                key={c.slug}
                id={c.slug}
                className="relative py-16 md:py-24 border-t border-white/10 first:border-t-0 scroll-mt-24"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                  <div className={`md:col-span-5 ${even ? "" : "md:order-2"}`}>
                    <Reveal>
                      <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
                        0{i + 1} / {site.categories.length}
                      </div>
                    </Reveal>
                    <Reveal delay={0.05}>
                      <h2
                        className={`text-display text-[clamp(3rem,10vw,9rem)] leading-[0.85] ${colorClass}`}
                      >
                        {c.short}
                      </h2>
                    </Reveal>
                    <Reveal delay={0.1}>
                      <div className="mt-4 font-mono text-sm uppercase tracking-widest text-ink-dim">
                        {c.label}
                      </div>
                    </Reveal>
                  </div>

                  <div
                    className={`md:col-span-7 ${
                      even ? "md:col-start-6" : "md:col-start-1 md:order-1"
                    }`}
                  >
                    <Reveal>
                      <p className="text-base md:text-lg leading-relaxed text-ink-dim">
                        {c.description}
                      </p>
                    </Reveal>

                    <Reveal delay={0.05}>
                      <dl className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-5 border-t border-white/10 pt-6">
                        {SPEC_ORDER.map((key) => (
                          <div
                            key={key}
                            className="flex flex-col gap-1.5 border-b border-white/5 pb-3"
                          >
                            <dt className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-faint">
                              {SPEC_LABELS[key]}
                            </dt>
                            <dd className="text-sm text-ink leading-snug">
                              {c.specs[key]}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    </Reveal>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mx-auto max-w-[1600px] px-5 md:px-10 mt-16 md:mt-24">
          <div className="border border-white/10 bg-bg-elev p-6 md:p-10">
            <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow mb-3">
              Note tecniche generali
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3 text-sm text-ink-dim leading-relaxed">
              <li>
                <span className="text-ink">Altezza minima da terra:</span>{" "}
                5 mm per le 1/10 Touring · 3 mm per le 1/12 Pancar.
              </li>
              <li>
                <span className="text-ink">Decal:</span> obbligatorie su fari
                e calandre, modelli sprovvisti non possono partecipare.
              </li>
              <li>
                <span className="text-ink">Gomme in lattice:</span> obbligo
                di acquisto in pista per lo svolgimento della gara.
              </li>
              <li>
                <span className="text-ink">Additivi:</span> liberi ma inodori.
              </li>
              <li>
                <span className="text-ink">Carica/scarica batterie:</span>{" "}
                limite 10 A in impianto, obbligo di liposack — pena la
                squalifica.
              </li>
              <li>
                <span className="text-ink">Regolamento completo:</span>{" "}
                Italian Indoor Series 2025/26, in vigore a RcLandia.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
