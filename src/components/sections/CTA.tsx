"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Marquee } from "../Marquee";

export function CTA() {
  return (
    <section className="relative py-24 md:py-40 bg-yellow text-bg overflow-hidden">
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="checker h-full w-full" />
      </div>

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="font-mono text-xs uppercase tracking-[0.3em] text-bg/70 mb-6">
          06 · Unisciti
        </div>
        <h2 className="text-display text-[clamp(3.5rem,14vw,16rem)] leading-[0.85]">
          <Line>Diventa</Line>
          <Line delay={0.1}>
            <em className="not-italic italic underline decoration-red decoration-[6px] underline-offset-[0.15em]">
              uno di noi
            </em>
            .
          </Line>
        </h2>

        <div className="mt-10 md:mt-16 grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
          <p className="md:col-span-5 text-bg/80 text-lg leading-relaxed max-w-md">
            Tesseramento aperto da settembre a giugno. Porta la tua RC, rispetta
            le regole della pista, lima i decimi giro dopo giro. Il resto viene
            da solo.
          </p>
          <div className="md:col-span-4 md:col-start-9 flex flex-wrap gap-3 md:justify-end">
            <Link
              href="/tesseramento"
              data-cursor="go"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-bg text-yellow font-mono text-sm uppercase tracking-widest font-semibold hover:bg-red hover:text-ink transition-colors"
            >
              Tesseramento <span>→</span>
            </Link>
            <Link
              href="/pista"
              data-cursor="regole"
              className="inline-flex items-center gap-3 px-8 py-4 border-2 border-bg text-bg font-mono text-sm uppercase tracking-widest hover:bg-bg hover:text-yellow transition-colors"
            >
              Regolamento
            </Link>
          </div>
        </div>
      </div>

      <div className="relative mt-20 md:mt-32 border-y-2 border-bg py-4">
        <Marquee speed={22}>
          {["Team La Gang", "★", "RcLandia", "★", "Since 2018", "★"].map(
            (w, i) => (
              <span
                key={i}
                className="text-display text-[clamp(2rem,6vw,5rem)] px-6"
              >
                {w}
              </span>
            ),
          )}
        </Marquee>
      </div>
    </section>
  );
}

function Line({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className="block"
    >
      {children}
    </motion.span>
  );
}
