import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contatti",
  description:
    "Come raggiungere RcLandia, iscrizione al Team La Gang, info tesseramento.",
};

export default function ContattiPage() {
  return (
    <>
      <PageHero
        index="06"
        label="Contatti"
        title="Scrivici"
        accent="in pit."
        color="red"
        subtitle="Una mail, un messaggio, oppure passaci a trovare in pista. La Gang risponde."
      />

      <section className="relative py-20 md:py-32 bg-bg-soft">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <Reveal>
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
                Dove siamo
              </div>
            </Reveal>
            <Reveal delay={0.05}>
              <h2 className="text-display text-4xl md:text-6xl leading-[0.95]">
                {site.track}
              </h2>
            </Reveal>

            <div className="mt-10 space-y-6">
              <Reveal>
                <Row
                  k="Indirizzo"
                  v="Via Fratelli Rosselli, 13 — 42019 Scandiano (Reggio Emilia) — Italy"
                />
              </Reveal>
              <Reveal>
                <Row
                  k="Email"
                  v="info@teamlagang.it"
                  link="mailto:info@teamlagang.it"
                />
              </Reveal>
              <Reveal>
                <Row
                  k="Apertura"
                  v="Feriali sera + weekend · dettaglio in pagina Pista"
                />
              </Reveal>
            </div>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <Reveal>
              <ContactForm />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

function Row({ k, v, link }: { k: string; v: string; link?: string }) {
  return (
    <div className="grid grid-cols-[120px_1fr] gap-4 py-3 border-b border-white/10">
      <span className="font-mono text-xs uppercase tracking-widest text-ink-faint">
        {k}
      </span>
      {link ? (
        <a href={link} className="text-ink hover:text-yellow transition-colors">
          {v}
        </a>
      ) : (
        <span className="text-ink">{v}</span>
      )}
    </div>
  );
}

