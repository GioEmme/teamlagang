"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

export function TrackSection() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const logoY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.1, 1, 0.95]);

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-40 overflow-hidden bg-blue"
    >
      <motion.div
        style={{ y: logoY, scale }}
        className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none"
      >
        <div className="relative w-[180%] h-[60%]">
          <Image
            src="/rclandia-logo.png"
            alt=""
            fill
            sizes="180vw"
            className="object-contain"
            aria-hidden
          />
        </div>
      </motion.div>

      <div className="absolute inset-0 bg-gradient-to-b from-blue/40 via-transparent to-blue-deep/80" />

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-6">
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-yellow mb-4">
              03 · La pista
            </div>
            <h2 className="text-display text-[clamp(3rem,8vw,8rem)] leading-[0.9] text-yellow">
              <RevealLine>RcLandia</RevealLine>
              <RevealLine delay={0.1} className="text-ink">
                è casa.
              </RevealLine>
            </h2>
            <p className="mt-8 text-ink leading-relaxed max-w-md text-lg">
              Pista indoor in moquette, tracciato permanente, 1000 m² su tre
              aree box. Aperta al pubblico tesserato: basta la tessera annuale
              e una macchina conforme al regolamento.
            </p>

            <div className="mt-10 flex flex-wrap gap-3">
              <Link
                href="/pista"
                data-cursor="info"
                className="inline-flex items-center gap-3 px-6 py-3 bg-yellow text-blue-deep font-mono text-xs uppercase tracking-widest font-semibold hover:bg-yellow-hot transition-colors"
              >
                Info pista <span>→</span>
              </Link>
              <Link
                href="/tesseramento"
                data-cursor="iscriviti"
                className="inline-flex items-center gap-3 px-6 py-3 border border-yellow text-yellow font-mono text-xs uppercase tracking-widest hover:bg-yellow hover:text-blue-deep transition-colors"
              >
                Tessere
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8 flex flex-col gap-4">
            <InfoRow k="Superficie" v="Moquette permanente" />
            <InfoRow k="Dimensione" v="1000 m² · 3 aree box" />
            <InfoRow k="Ambiente" v="Indoor" />
            <InfoRow k="Accesso" v="Previo tesseramento + rispetto regolamento" />
            <InfoRow k="Fondazione" v="2018" />
            <InfoRow k="Categorie" v="7 attive" />
          </div>
        </div>

        <div className="mt-20 md:mt-28">
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-yellow mb-6 md:mb-8">
            Orari di apertura · Stagione 2025/26
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <ScheduleCard day="Mercoledì" tag="Serale" hours="20:00 — 24:00" />
            <ScheduleCard day="Sabato" tag="Giornata piena" hours="09:00 — 19:00" />
            <ScheduleCard day="Domenica" tag="Giornata piena" hours="09:00 — 19:00" />
          </div>
        </div>
      </div>
    </section>
  );
}

function ScheduleCard({
  day,
  tag,
  hours,
}: {
  day: string;
  tag: string;
  hours: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="relative group bg-blue-deep/40 backdrop-blur-sm border border-yellow/30 hover:border-yellow transition-colors p-6 md:p-8 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-16 h-16 border-l border-b border-yellow/20" />
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow/70 mb-3">
        {tag}
      </div>
      <div className="text-display text-4xl md:text-5xl text-ink leading-none mb-6">
        {day}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-display text-3xl md:text-4xl text-yellow leading-none">
          {hours}
        </span>
      </div>
    </motion.div>
  );
}

function RevealLine({
  children,
  delay = 0,
  className,
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}
      className={`block ${className ?? ""}`}
    >
      {children}
    </motion.span>
  );
}

function InfoRow({ k, v }: { k: string; v: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="grid grid-cols-[140px_1fr] gap-4 py-4 border-b border-yellow/20"
    >
      <span className="font-mono text-xs uppercase tracking-widest text-yellow/80">
        {k}
      </span>
      <span className="text-ink">{v}</span>
    </motion.div>
  );
}
