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
              Pista indoor, moquette, illuminazione costante, barriere sicure.
              Aperta al pubblico: basta il tesseramento e la tua macchina
              rispettosa delle regole.
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
                href="/contatti"
                data-cursor="iscriviti"
                className="inline-flex items-center gap-3 px-6 py-3 border border-yellow text-yellow font-mono text-xs uppercase tracking-widest hover:bg-yellow hover:text-blue-deep transition-colors"
              >
                Tessere
              </Link>
            </div>
          </div>

          <div className="md:col-span-5 md:col-start-8 flex flex-col gap-4">
            <InfoRow k="Superficie" v="Moquette, tracciato permanente" />
            <InfoRow k="Ambiente" v="Indoor, temperatura controllata" />
            <InfoRow k="Accesso" v="Previa tessera + rispetto regolamento" />
            <InfoRow k="Illuminazione" v="LED uniforme, zero ombre" />
            <InfoRow k="Box" v="Postazioni piloti, carica batterie, officina" />
            <InfoRow k="Orari" v="Calendario aggiornato · vedi Pista" />
          </div>
        </div>
      </div>
    </section>
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
