"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Marquee } from "../Marquee";

export function IntroManifesto({ image }: { image?: string | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "-3%"]);
  const bgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const bgScale = useTransform(scrollYProgress, [0, 1], [1.1, 1.2]);
  const marqueeOpacity = useTransform(scrollYProgress, [0.85, 0.95], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative pt-24 md:pt-40 pb-8 md:pb-16 overflow-hidden bg-bg"
    >
      {image ? (
        <>
          <motion.div
            style={{ y: bgY, scale: bgScale }}
            className="absolute inset-0 will-change-transform"
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="100vw"
              priority={false}
              className="object-cover"
              aria-hidden
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-bg/70 via-bg/80 to-bg pointer-events-none" />
          <div className="absolute inset-0 bg-bg/40 pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
            <div className="checker h-full w-full" />
          </div>
        </>
      ) : (
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
          <div className="checker h-full w-full" />
        </div>
      )}

      <motion.div
        style={{ y }}
        className="relative mx-auto max-w-[1600px] px-5 md:px-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-3">
            <div className="sticky top-28">
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
                01 · Passione e valori
              </div>
              <div className="relative w-20 h-20 rounded-full border border-yellow/30 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-yellow animate-pulse" />
                <div className="absolute inset-0 rounded-full border border-yellow/20 animate-ping" />
              </div>
            </div>
          </div>

          <div className="md:col-span-9">
            <h2 className="text-display text-[clamp(2.4rem,6vw,6rem)] leading-[0.92]">
              <RevealLine>Non è un hobby.</RevealLine>
              <RevealLine delay={0.1}>
                È <em className="not-italic text-yellow">velocità</em>,
              </RevealLine>
              <RevealLine delay={0.2}>
                precisione, <em className="not-italic text-red">assetto</em>,
              </RevealLine>
              <RevealLine delay={0.3}>centesimi che contano.</RevealLine>
              <RevealLine delay={0.4}>
                E si corre <em className="not-italic text-yellow">tra amici</em>.
              </RevealLine>
            </h2>

            <div className="mt-12 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
              <Stat k="2018" v="Fondazione" />
              <Stat k="7" v="Categorie attive" />
              <Stat k="1000m²" v="Pista indoor" />
              <Stat k="~100" v="Piloti · 3 aree box" />
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div
        style={{ opacity: marqueeOpacity }}
        className="relative mt-8 md:mt-12"
      >
        <Marquee speed={28}>
          {["Velocità", "Assetto", "Precisione", "Racing", "Community", "Adrenalina"].map(
            (w, i) => (
              <span
                key={i}
                className="text-display text-[clamp(3rem,10vw,10rem)] px-8 text-transparent [-webkit-text-stroke:1px_#2a2a2a] md:[-webkit-text-stroke:2px_#2a2a2a]"
              >
                {w} ·
              </span>
            ),
          )}
        </Marquee>
      </motion.div>
    </section>
  );
}

function RevealLine({
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

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-white/10 pt-4"
    >
      <div className="text-display text-4xl md:text-5xl text-yellow">{k}</div>
      <div className="font-mono text-xs uppercase tracking-widest text-ink-dim mt-2">
        {v}
      </div>
    </motion.div>
  );
}
