"use client";

import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

export function Categories({ images = {} }: { images?: Record<string, string> }) {
  const ref = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const maxXRef = useRef(0);
  const [active, setActive] = useState(0);
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
    // Settle phase: first 15% = no horizontal scroll, cards settle in view
    // Then linear scroll from 0.15 → 1.0 across full maxX range
    const settled = Math.max(0, (p - 0.15) / 0.85);
    x.set(settled * maxXRef.current);
  });

  const headerOpacity = useTransform(enterProgress, [0.5, 0.8], [0, 1]);
  const headerY = useTransform(enterProgress, [0.5, 0.8], [40, 0]);

  return (
    <section
      ref={ref}
      className="relative bg-bg-soft"
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
                02 · Categorie
              </div>
              <h2 className="text-display text-[clamp(2rem,5vw,5rem)] leading-[0.9]">
                Sette modi
                <br />
                <span className="text-yellow">di andare forte.</span>
              </h2>
            </div>
            <p className="md:max-w-sm text-ink-dim leading-relaxed">
              Dalla scuola Tamiya TT02 fino alla modificata senza limiti.
              Passando per la 1/12 Pancar, i piccoli bolidi da velocità, ma
              anche la categoria GT12 &amp; LM per i più malinconici.
            </p>
          </div>
        </motion.div>

        <motion.div
          ref={sliderRef}
          style={{ x }}
          className="flex gap-5 md:gap-8 pl-5 md:pl-10 pr-10 md:pr-20 will-change-transform"
        >
          {site.categories.map((cat, i) => {
            const img = images[cat.slug];
            return (
            <Link
              key={cat.slug}
              href={`/categorie#${cat.slug}`}
              data-cursor={cat.short}
              onMouseEnter={() => setActive(i)}
              className={cn(
                "group relative flex-none w-[70vw] md:w-[min(380px,42vh)] aspect-[4/5] overflow-hidden border transition-colors",
                active === i
                  ? "border-yellow"
                  : "border-white/10 hover:border-white/30",
              )}
            >
              {img && (
                <div className="absolute inset-0">
                  <Image
                    src={img}
                    alt={cat.label}
                    fill
                    sizes="(max-width: 768px) 70vw, 420px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/60 to-bg/20" />
                </div>
              )}
              <div
                className={cn(
                  "absolute inset-0 transition-opacity duration-700 pointer-events-none",
                  img && "mix-blend-overlay opacity-60",
                  i % 3 === 0
                    ? "bg-gradient-to-br from-yellow/20 via-yellow/5 to-transparent"
                    : i % 3 === 1
                      ? "bg-gradient-to-br from-red/20 via-red/5 to-transparent"
                      : "bg-gradient-to-br from-blue/20 via-blue/5 to-transparent",
                )}
              />
              {!img && <div className="absolute inset-0 checker opacity-[0.03]" />}

              <div className="absolute top-6 left-6 right-6 flex justify-between items-start">
                <span className="font-mono text-xs uppercase tracking-widest text-ink-dim">
                  0{i + 1}
                </span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                  Categoria
                </span>
              </div>

              <div className="absolute inset-x-6 bottom-6 flex flex-col gap-3">
                <div className="text-display text-5xl md:text-6xl leading-[0.9] text-ink group-hover:text-yellow transition-colors duration-500">
                  {cat.short}
                </div>
                <div className="text-sm font-mono uppercase tracking-widest text-ink-dim">
                  {cat.label}
                </div>
                <p className="text-ink-dim text-sm max-w-[80%] leading-relaxed">
                  {cat.blurb}
                </p>
                <div className="flex items-center gap-2 mt-2 text-xs font-mono uppercase tracking-widest text-yellow opacity-0 group-hover:opacity-100 transition-opacity">
                  Scopri <span>→</span>
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
