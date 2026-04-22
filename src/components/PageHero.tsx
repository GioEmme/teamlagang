"use client";

import { motion } from "framer-motion";

type Props = {
  index: string;
  label: string;
  title: string;
  accent?: string;
  subtitle?: string;
  color?: "yellow" | "red" | "blue";
};

export function PageHero({
  index,
  label,
  title,
  accent,
  subtitle,
  color = "yellow",
}: Props) {
  const colorClass =
    color === "yellow"
      ? "text-yellow"
      : color === "red"
        ? "text-red"
        : "text-blue";

  return (
    <section className="relative pt-40 md:pt-52 pb-20 md:pb-32 overflow-hidden bg-bg">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none checker" />

      <div className="relative mx-auto max-w-[1600px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-center gap-4 font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-6 md:mb-10"
        >
          <span>{index}</span>
          <span className="w-8 h-px bg-ink-faint" />
          <span>{label}</span>
        </motion.div>

        <h1 className="text-display text-[clamp(3rem,12vw,12rem)] leading-[0.85]">
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: "0%" }}
              transition={{
                duration: 1.2,
                delay: 0.15,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="block"
            >
              {title}
            </motion.span>
          </span>
          {accent && (
            <span className="block overflow-hidden">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{
                  duration: 1.2,
                  delay: 0.3,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`block ${colorClass}`}
              >
                {accent}
              </motion.span>
            </span>
          )}
        </h1>

        {subtitle && (
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 md:mt-12 max-w-2xl text-ink-dim text-lg leading-relaxed"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
