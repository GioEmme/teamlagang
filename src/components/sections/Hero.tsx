"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero3D = dynamic(
  () => import("../Hero3D").then((m) => m.Hero3D),
  { ssr: false, loading: () => null },
);

export function Hero() {
  return (
    <section className="relative h-[100svh] min-h-[640px] overflow-hidden bg-bg">
      <Hero3D />

      {/* Gradient overlays for readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/60 via-transparent to-bg" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg/40 via-transparent to-bg/40" />

      {/* Corner markers */}
      <div className="pointer-events-none absolute top-24 md:top-28 left-5 md:left-10 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-ink-dim">
        <div>N. 44° 27&apos;</div>
        <div>E. 11° 22&apos;</div>
      </div>
      <div className="pointer-events-none absolute top-24 md:top-28 right-5 md:right-10 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-ink-dim text-right">
        <div>Indoor · Asfalto</div>
        <div>A.S. · Est. racing</div>
      </div>

      {/* Main copy */}
      <div className="relative z-10 h-full flex flex-col justify-end pb-16 md:pb-24">
        <div className="mx-auto max-w-[1600px] w-full px-5 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="font-mono text-xs uppercase tracking-[0.4em] text-yellow mb-4 md:mb-6"
          >
            <span className="inline-block w-8 h-px bg-yellow align-middle mr-3" />
            A.S. Team La Gang presenta
          </motion.div>

          <h1 className="text-display leading-[0.82] text-[clamp(4rem,14vw,14rem)]">
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 1.2,
                  delay: 0.4,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block"
              >
                RcLandia
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 1.2,
                  delay: 0.55,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="block text-transparent [-webkit-text-stroke:1px_#ffd500] md:[-webkit-text-stroke:2px_#ffd500]"
              >
                Pista RC
              </motion.span>
            </span>
          </h1>

          <div className="mt-8 md:mt-12 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-end">
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8 }}
              className="md:col-span-5 text-ink-dim leading-relaxed max-w-md"
            >
              Asfalto liscio. Gomme calde. Servocomandi al millisecondo. RcLandia è
              la pista indoor del Team La Gang, aperta a chiunque voglia mettere
              giù un cronometro vero.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05, duration: 0.8 }}
              className="md:col-span-4 md:col-start-9 flex flex-wrap gap-3 md:justify-end"
            >
              <Link
                href="/pista"
                data-cursor="esplora"
                className="group relative inline-flex items-center gap-3 px-6 py-3 bg-yellow text-bg font-mono text-xs uppercase tracking-widest font-semibold overflow-hidden"
              >
                <span className="relative z-10">Scopri la pista</span>
                <span className="relative z-10">→</span>
                <span className="absolute inset-0 bg-yellow-hot -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
              </Link>
              <Link
                href="/contatti"
                data-cursor="iscrizione"
                className="inline-flex items-center gap-3 px-6 py-3 border border-white/30 font-mono text-xs uppercase tracking-widest hover:border-yellow hover:text-yellow transition-colors"
              >
                Tesseramento
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.8 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-dim"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.3em]">
          Scroll
        </span>
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-8 bg-gradient-to-b from-yellow to-transparent"
        />
      </motion.div>
    </section>
  );
}
