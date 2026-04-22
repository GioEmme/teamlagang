import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { site } from "@/lib/site";

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
                <Row k="Indirizzo" v="Via da definire, Città — Italia" />
              </Reveal>
              <Reveal>
                <Row k="Email" v="info@teamlagang.it" link="mailto:info@teamlagang.it" />
              </Reveal>
              <Reveal>
                <Row k="Telefono" v="+39 000 000 0000" link="tel:+390000000000" />
              </Reveal>
              <Reveal>
                <Row k="Apertura" v="Feriali sera + weekend · dettaglio in pagina Pista" />
              </Reveal>
            </div>

            <Reveal>
              <div className="mt-10 p-6 bg-bg border border-yellow/30">
                <div className="text-xs font-mono uppercase tracking-widest text-yellow mb-2">
                  Tesseramento
                </div>
                <p className="text-sm text-ink-dim leading-relaxed">
                  Scrivi a tesseramento@teamlagang.it per ricevere modulo iscrizione e dettagli quote. Richiesta documento identità e foto tessera.
                </p>
              </div>
            </Reveal>
          </div>

          <div className="md:col-span-6 md:col-start-7">
            <Reveal>
              <form className="flex flex-col gap-5">
                <Field label="Nome" name="name" />
                <Field label="Email" name="email" type="email" />
                <Field label="Categoria di interesse" name="category" placeholder="Es. 1/10 Stock, TT02…" />
                <TextArea label="Messaggio" name="message" />
                <button
                  type="submit"
                  data-cursor="invia"
                  className="mt-2 inline-flex items-center justify-center gap-3 px-8 py-4 bg-yellow text-bg font-mono text-xs uppercase tracking-widest font-semibold hover:bg-yellow-hot transition-colors self-start"
                >
                  Invia messaggio <span>→</span>
                </button>
                <p className="text-xs text-ink-faint font-mono mt-2">
                  Form demo · backend da collegare in produzione.
                </p>
              </form>
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

function Field({
  label,
  name,
  type = "text",
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
        {label}
      </span>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        className="bg-transparent border-b border-white/20 focus:border-yellow py-3 outline-none text-ink placeholder:text-ink-faint transition-colors"
      />
    </label>
  );
}

function TextArea({ label, name }: { label: string; name: string }) {
  return (
    <label className="flex flex-col gap-2">
      <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
        {label}
      </span>
      <textarea
        name={name}
        rows={5}
        className="bg-transparent border-b border-white/20 focus:border-yellow py-3 outline-none text-ink resize-none transition-colors"
      />
    </label>
  );
}
