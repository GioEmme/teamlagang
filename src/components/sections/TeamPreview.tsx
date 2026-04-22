"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/cn";

const pilots = [
  { num: "01", name: "Alberto", role: "Il Presidente", cat: "1/12 GT", bio: "...non serve aggiungere altro." },
  { num: "02", name: "Isacco", role: "Il Vice", cat: "", bio: "Braccio destro del presidente e Direttore Gara ACI del team." },
  { num: "03", name: "Alberto", role: "Il Tesoriere", cat: "", bio: "L'economo del gruppo." },
  { num: "04", name: "Roberto", role: "Il Segretario", cat: "", bio: "Lui controlla e verbalizza... verbalizza e controlla." },
  { num: "05", name: "Alessandro", role: "Il Creativo", cat: "FWD", bio: "Chi sale sul podio avrà una sua opera tra le mani!" },
  { num: "06", name: "Andrea", role: "Lui sa chi chiamare...", cat: "Stock", bio: "Serve qualcuno? Lui sa indirizzarti dalla persona giusta!" },
  { num: "07", name: "Alessandro", role: "Il Verificatore", cat: "", bio: "A lui non scappa niente, quindi attenzione al banco controlli!" },
  { num: "08", name: "Danilo", role: "Il Saggio", cat: "1/10 GT", bio: "La voce saggia del gruppo, l'esperienza degli anni." },
  { num: "09", name: "Enrico", role: "", cat: "1/10 GT", bio: "" },
  { num: "10", name: "Giovanni", role: "L'ultimo arrivato... anche in gara!", cat: "1/12 GT", bio: "Sul setup ha ancora tanto da imparare." },
];

export function TeamPreview({
  images = {},
}: {
  images?: Record<string, string>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const maxXRef = useRef(0);
  const x = useMotionValue(0);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    const measure = () => {
      const containerW = el.scrollWidth;
      const viewportW = window.innerWidth;
      const overflow = containerW - viewportW;
      maxXRef.current = overflow > 0 ? -overflow : 0;
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: enterProgress } = useScroll({
    target: ref,
    offset: ["start end", "start start"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const settled = Math.max(0, (p - 0.15) / 0.85);
    x.set(settled * maxXRef.current);
  });

  const headerOpacity = useTransform(enterProgress, [0.5, 0.8], [0, 1]);
  const headerY = useTransform(enterProgress, [0.5, 0.8], [40, 0]);

  return (
    <section
      ref={ref}
      className="relative bg-bg"
      style={{ height: "260vh" }}
    >
      <div className="sticky top-0 h-screen flex flex-col pt-[10vh] md:pt-[11vh] pb-16 md:pb-20 overflow-hidden">
        <motion.div
          style={{ opacity: headerOpacity, y: headerY }}
          className="mx-auto max-w-[1600px] w-full px-5 md:px-10 mb-6 md:mb-10"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-3">
                04 · Team
              </div>
              <h2 className="text-display text-[clamp(2rem,5vw,5rem)] leading-[0.9]">
                I piloti della
                <br />
                <span className="text-red">Gang.</span>
              </h2>
            </div>
            <Link
              href="/team"
              data-cursor="team"
              className="inline-flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-yellow hover:text-yellow-hot"
            >
              Tutti i piloti <span>→</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          ref={sliderRef}
          style={{ x }}
          className="flex gap-5 md:gap-8 pl-5 md:pl-10 pr-10 md:pr-20 will-change-transform"
        >
          {pilots.map((p) => {
            const img = images[p.num];
            return (
              <Link
                key={p.num}
                href="/team"
                data-cursor={`#${p.num}`}
                className={cn(
                  "group relative flex-none w-[70vw] md:w-[min(380px,42vh)] aspect-[4/5] overflow-hidden border border-white/10 hover:border-yellow transition-colors bg-bg-elev",
                )}
              >
                {img && (
                  <div className="absolute inset-0">
                    <Image
                      src={img}
                      alt={p.name}
                      fill
                      sizes="(max-width: 768px) 70vw, 380px"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/50 to-transparent" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-br from-red/10 via-transparent to-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                {!img && (
                  <div className="absolute inset-0 flex items-center justify-center text-display text-[14rem] text-white/[0.05] group-hover:text-yellow/20 transition-colors duration-700 select-none">
                    {p.num}
                  </div>
                )}
                <div className="absolute inset-0 p-5 md:p-6 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    {p.role ? (
                      <span className="px-2 py-1 bg-yellow text-bg text-[10px] font-mono uppercase tracking-widest font-semibold">
                        {p.role}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="font-mono text-xs uppercase tracking-widest text-ink-dim">
                      #{p.num}
                    </span>
                  </div>
                  <div>
                    <div className="text-display text-2xl md:text-3xl leading-tight group-hover:text-yellow transition-colors">
                      {p.name}
                    </div>
                    {p.cat && (
                      <div className="text-xs font-mono uppercase tracking-widest text-red mt-1">
                        {p.cat}
                      </div>
                    )}
                  </div>
                </div>
                <div className="absolute inset-x-0 bottom-0 h-1 bg-yellow origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-700" />
              </Link>
            );
          })}
          <div className="flex-none w-10 md:w-20" aria-hidden />
        </motion.div>
      </div>
    </section>
  );
}
