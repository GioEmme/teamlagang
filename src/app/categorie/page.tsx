import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Categorie",
  description:
    "Le categorie RC di RcLandia: 1/10 Touring GT/Stock/Modificata, 1/10 FWD, 1/12 GT, 1/12 Pancar, TT02.",
};

const details: Record<
  string,
  { specs: string[]; note: string }
> = {
  "touring-gt": {
    specs: ["Scala 1/10", "Carrozzeria GT", "Motore brushless limitato", "Gomme omologate pista"],
    note: "Gran turismo 1/10, look racing spettacolare, tempi sul giro competitivi.",
  },
  "touring-stock": {
    specs: ["Scala 1/10", "Motore 17.5T - 21.5T", "ESC blinky", "Gomme controllate"],
    note: "Categoria scuola per eccellenza. Tutti uguali, conta solo guida e assetto.",
  },
  "touring-modificata": {
    specs: ["Scala 1/10", "Motore open modified", "ESC no limits", "Setup libero"],
    note: "Prestazioni estreme, energia massima, zero compromessi.",
  },
  fwd: {
    specs: ["Scala 1/10", "Sola trazione anteriore", "Telaio dedicato", "Motore controllato"],
    note: "Guida tecnica, ingressi tardivi, trazione limitata. Divertimento puro.",
  },
  gt12: {
    specs: ["Scala 1/12", "Formato GT", "Carrozzeria chiusa", "Motore controllato"],
    note: "Compatta, leggera, precisa. Il 1/12 in chiave moderna.",
  },
  pancar: {
    specs: ["Scala 1/12", "Telaio piatto", "Niente ammortizzatori", "Storica categoria RC"],
    note: "La più pura. Moquette liscia, telaio basso, feeling diretto.",
  },
  tt02: {
    specs: ["Monomarca Tamiya TT02", "Motore Silvercan", "Batteria Tamiya", "Setup limitato"],
    note: "Accesso facile, costi contenuti, divertimento massimo.",
  },
};

export default function CategoriePage() {
  return (
    <>
      <PageHero
        index="03"
        label="Categorie"
        title="Sette"
        accent="discipline."
        subtitle="Dalla scuola stock alla modificata open. Dal monomarca TT02 alla pura Pancar. Ogni classe ha un suo linguaggio, un suo ritmo."
      />

      <section className="relative pb-20 md:pb-32 bg-bg">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          {site.categories.map((c, i) => {
            const d = details[c.slug];
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
                className="relative py-16 md:py-24 border-t border-white/10 first:border-t-0"
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                  <div className={`md:col-span-5 ${even ? "" : "md:order-2"}`}>
                    <Reveal>
                      <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
                        0{i + 1} / {site.categories.length}
                      </div>
                    </Reveal>
                    <Reveal delay={0.05}>
                      <h2 className={`text-display text-[clamp(3rem,10vw,9rem)] leading-[0.85] ${colorClass}`}>
                        {c.short}
                      </h2>
                    </Reveal>
                    <Reveal delay={0.1}>
                      <div className="mt-4 font-mono text-sm uppercase tracking-widest text-ink-dim">
                        {c.label}
                      </div>
                    </Reveal>
                  </div>

                  <div className={`md:col-span-6 ${even ? "md:col-start-7" : "md:col-start-1 md:order-1"}`}>
                    <Reveal>
                      <p className="text-lg leading-relaxed text-ink">
                        {d.note}
                      </p>
                    </Reveal>
                    <div className="mt-8 space-y-3">
                      {d.specs.map((s) => (
                        <Reveal key={s}>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="w-1.5 h-1.5 rounded-full bg-yellow flex-none" />
                            <span className="text-ink-dim">{s}</span>
                          </div>
                        </Reveal>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </>
  );
}
