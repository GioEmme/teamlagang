import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";

export const metadata: Metadata = {
  title: "News",
  description: "Tutte le news dalla pista RcLandia.",
};

const posts = [
  {
    slug: "trofeo-primavera-finale",
    date: "2026-04-12",
    tag: "Gara",
    title: "Trofeo di primavera · classifica finale",
    excerpt:
      "Chiusa la tre giorni di 1/10 Touring GT. Podio tutto interno al Team La Gang, margini strettissimi fino all'ultima manche.",
  },
  {
    slug: "nuova-configurazione",
    date: "2026-04-05",
    tag: "Pista",
    title: "Nuova configurazione del tracciato",
    excerpt:
      "Due curve ridisegnate, chicane aggiunta in rettilineo. Test positivo in pre-briefing.",
  },
  {
    slug: "stagione-2026-aperta",
    date: "2026-03-22",
    tag: "Tesseramento",
    title: "Aperte le iscrizioni stagione 2026",
    excerpt:
      "Nuove agevolazioni per under 16, rientro 1/12 Pancar in calendario ufficiale.",
  },
  {
    slug: "rookie-cup",
    date: "2026-03-08",
    tag: "Scuola",
    title: "Rookie Cup · nasce la categoria scuola",
    excerpt:
      "Per chi inizia: affiancamento con piloti senior, telaio TT02 consigliato.",
  },
  {
    slug: "fwd-challenge-recap",
    date: "2026-03-02",
    tag: "Gara",
    title: "FWD Challenge · recap",
    excerpt:
      "Categoria FWD tornata in grande forma. Parco partenti raddoppiato rispetto al 2025.",
  },
  {
    slug: "nuove-luci-box",
    date: "2026-02-15",
    tag: "Pista",
    title: "Nuovi LED zona box",
    excerpt:
      "Illuminazione meccanici rifatta. Uniformità +40%, zero ombre durante i pit stop.",
  },
];

export default function NewsPage() {
  return (
    <>
      <PageHero
        index="05"
        label="News"
        title="Dalla"
        accent="box."
        color="yellow"
        subtitle="Ultime gare, aggiornamenti pista, racconti dal paddock. Il cronometro parla, ma anche la box ha cose da dire."
      />

      <section className="relative py-16 md:py-24 bg-bg">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <div className="divide-y divide-white/10 border-y border-white/10">
            {posts.map((p) => (
              <Reveal key={p.slug}>
                <article className="group grid grid-cols-12 gap-4 md:gap-6 py-8 md:py-12 items-start hover:bg-bg-elev transition-colors px-2 md:px-4">
                  <div className="col-span-12 md:col-span-2 flex md:flex-col gap-3 md:gap-2">
                    <time className="font-mono text-xs text-ink-dim">
                      {new Date(p.date).toLocaleDateString("it-IT", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </time>
                    <span className="px-2 py-0.5 bg-yellow text-bg text-[10px] font-mono uppercase tracking-widest font-semibold inline-block self-start">
                      {p.tag}
                    </span>
                  </div>
                  <div className="col-span-12 md:col-span-8">
                    <h2 className="text-display text-3xl md:text-5xl leading-tight group-hover:text-yellow transition-colors">
                      {p.title}
                    </h2>
                    <p className="mt-3 text-ink-dim leading-relaxed max-w-2xl">
                      {p.excerpt}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-2 flex md:justify-end items-center gap-2 text-xs font-mono uppercase tracking-widest text-yellow opacity-70 group-hover:opacity-100 transition-opacity">
                    Leggi <span>→</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
