"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";

type Props = {
  images: string[];
};

export function HeroCarousel({ images }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  const hasImages = images.length > 0;
  const total = Math.max(images.length, 1);

  // Pinned section length grows with image count (min 200vh, 100vh per extra)
  const sectionVh = Math.max(200, 100 + total * 80);

  return (
    <section
      ref={ref}
      className="relative bg-bg"
      style={{ height: `${sectionVh}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Images stack */}
        {hasImages ? (
          images.map((src, i) => (
            <HeroImage
              key={src}
              src={src}
              index={i}
              total={total}
              progress={scrollYProgress}
            />
          ))
        ) : (
          <HeroFallback />
        )}

        {/* Dark vignette overlays for text readability */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg/40 via-transparent to-bg z-10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg/60 via-transparent to-bg/60 z-10" />

        {hasImages && (
          <ImageCounter progress={scrollYProgress} total={total} />
        )}

        {/* Main copy — label top, h1 bottom, nothing overlaps */}
        <div className="relative z-20 h-full flex flex-col pt-24 md:pt-32 pb-12 md:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="mx-auto max-w-[1600px] w-full px-5 md:px-10 font-mono text-xs uppercase tracking-[0.4em] text-yellow"
          >
            <span className="inline-block w-8 h-px bg-yellow align-middle mr-3" />
            A.S. Team La Gang presenta
          </motion.div>

          <div className="mx-auto max-w-[1600px] w-full px-5 md:px-10 mt-auto">
            <h1 className="text-display leading-[0.85] text-[clamp(3rem,10vw,10rem)]">
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
                Moquette sotto le ruote. Gomme calde. Radiocomandi alla mano.
                RcLandia è la pista indoor del Team La Gang, aperta a chiunque
                voglia provare l&apos;ebbrezza della guida RC e divertirsi in
                avvincenti gare tra amici, in un ambiente rilassato dove si
                corre prima per passione. Gareggiare non è un obbligo: la pista
                è aperta a chi ha voglia di divertirsi.
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
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-dim z-20"
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
      </div>
      <div id="hero-sentinel" aria-hidden className="absolute bottom-0 h-px w-full" />
    </section>
  );
}

function HeroImage({
  src,
  index,
  total,
  progress,
}: {
  src: string;
  index: number;
  total: number;
  progress: MotionValue<number>;
}) {
  // Map progress [0..1] to continuous index [0..total-1]
  const activeIdx = useTransform(progress, (p) =>
    Math.min(total - 1, Math.max(0, p * (total - 1))),
  );

  // Opacity: 1 at own index, linear crossfade to neighbors
  const opacity = useTransform(activeIdx, (a) => {
    const d = Math.abs(a - index);
    if (d >= 1) return 0;
    return 1 - d;
  });

  // Ken Burns: scale + drift keyed to distance from own index
  const scale = useTransform(activeIdx, (a) => {
    const d = a - index; // negative before, positive after
    // Start zoomed 1.12, arrive at 1.0 on index, continue to 0.94 after
    return Math.max(0.94, Math.min(1.12, 1.06 - d * 0.06));
  });
  const tx = useTransform(activeIdx, (a) => `${(a - index) * -2}%`);
  const ty = useTransform(activeIdx, (a) => `${(a - index) * 1.5}%`);

  return (
    <motion.div
      className="absolute inset-0 will-change-[opacity,transform]"
      style={{ opacity }}
    >
      <motion.div
        className="absolute inset-0"
        style={{ scale, x: tx, y: ty }}
      >
        <Image
          src={src}
          alt=""
          fill
          priority={index === 0}
          sizes="100vw"
          className="object-cover"
        />
      </motion.div>
    </motion.div>
  );
}

function HeroFallback() {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-bg via-blue-deep/30 to-bg" />
      <div className="absolute inset-0 checker opacity-[0.04]" />
      <div className="relative text-center px-5">
        <div className="font-mono text-xs uppercase tracking-widest text-yellow">
          Setup hero
        </div>
        <p className="mt-2 text-ink-dim text-sm">
          Carica immagini in <code className="text-yellow">/public/hero/</code>{" "}
          per attivare la sequenza.
        </p>
      </div>
    </div>
  );
}

function ImageCounter({
  progress,
  total,
}: {
  progress: MotionValue<number>;
  total: number;
}) {
  const idx = useTransform(progress, (p) => {
    const v = Math.min(total - 1, Math.round(p * (total - 1)));
    return String(v + 1).padStart(2, "0");
  });
  const pct = useTransform(progress, (p) => `${Math.round(p * 100)}%`);
  const barX = useTransform(progress, [0, 1], ["-100%", "0%"]);

  return (
    <div className="pointer-events-none absolute top-24 md:top-28 right-5 md:right-10 z-20 flex flex-col items-end gap-2">
      <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-ink-dim flex items-baseline gap-2">
        <motion.span className="text-yellow text-sm md:text-base">
          {idx}
        </motion.span>
        <span>/ {String(total).padStart(2, "0")}</span>
      </div>
      <div className="w-32 h-px bg-white/20 overflow-hidden">
        <motion.div
          style={{ x: barX }}
          className="h-full w-full bg-yellow"
        />
      </div>
      <motion.span className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.3em] text-ink-faint">
        {pct}
      </motion.span>
    </div>
  );
}
