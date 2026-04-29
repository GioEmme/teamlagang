"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/site";
import type { NextEventTeaser } from "@/lib/myrcm";

type Social = {
  name: string;
  url: string;
  color: string;
  icon: React.FC<{ className?: string }>;
};

const IgIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    className={className}
    aria-hidden
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const FbIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M13.5 9V7.5c0-.55.45-1 1-1H16V4h-2.5A3.5 3.5 0 0 0 10 7.5V9H8v2.5h2V20h3.5v-8.5H16l.5-2.5h-3Z" />
  </svg>
);

const YtIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden
  >
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.76-1.77C18.27 5 12 5 12 5s-6.27 0-7.84.43A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.76 1.77C5.73 19 12 19 12 19s6.27 0 7.84-.43a2.5 2.5 0 0 0 1.76-1.77A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  </svg>
);

const PullstartIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <circle cx="12" cy="12" r="9.5" />
    <path d="M10 8.5 L16 12 L10 15.5 Z" fill="currentColor" stroke="none" />
  </svg>
);

const MyrcmIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <circle cx="12" cy="13.5" r="7" />
    <path d="M12 13.5 V9.5" />
    <path d="M12 13.5 L15 15.5" />
    <path d="M10 3 H14" />
    <path d="M12 3 V6.5" />
  </svg>
);

const s = site.social as Record<string, string | undefined>;
const socials: Social[] = (
  [
    s.instagram
      ? { name: "Instagram", url: s.instagram, color: "#E4405F", icon: IgIcon }
      : null,
    s.facebook
      ? { name: "Facebook", url: s.facebook, color: "#1877F2", icon: FbIcon }
      : null,
    s.youtube
      ? { name: "YouTube", url: s.youtube, color: "#FF0000", icon: YtIcon }
      : null,
    s.pullstart
      ? {
          name: "Pullstart",
          url: s.pullstart,
          color: "#FF6B00",
          icon: PullstartIcon,
        }
      : null,
    s.myrcm
      ? {
          name: "MyRCM",
          url: s.myrcm,
          color: "#00B894",
          icon: MyrcmIcon,
        }
      : null,
  ] as (Social | null)[]
).filter((x): x is Social => x !== null);

export function SocialRail({
  nextEvent = null,
}: {
  nextEvent?: NextEventTeaser | null;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [eventHover, setEventHover] = useState(false);
  const [attention, setAttention] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setAttention(false), 3500);
    return () => clearTimeout(t);
  }, []);

  if (socials.length === 0 && !nextEvent) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 1.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed right-4 lg:right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col gap-3 items-center"
    >
      {nextEvent ? (
        <>
          <Link
            href="/eventi"
            data-cursor="vai"
            aria-label={`Prossimo evento: ${nextEvent.name} tra ${nextEvent.daysUntil} giorni`}
            onMouseEnter={() => setEventHover(true)}
            onMouseLeave={() => setEventHover(false)}
            className="group relative"
          >
            {/* Two staggered pulse rings, continuous */}
            <motion.span
              aria-hidden
              animate={{ scale: [1, 2.2], opacity: [0.55, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeOut",
              }}
              className="absolute inset-0 rounded-full border-2 border-yellow pointer-events-none"
            />
            <motion.span
              aria-hidden
              animate={{ scale: [1, 2.2], opacity: [0.55, 0] }}
              transition={{
                duration: 1.6,
                repeat: Infinity,
                ease: "easeOut",
                delay: 0.8,
              }}
              className="absolute inset-0 rounded-full border-2 border-yellow pointer-events-none"
            />

            <motion.span
              animate={{ scale: eventHover ? 1.12 : 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              className="relative w-10 h-10 rounded-full bg-yellow text-bg flex flex-col items-center justify-center font-display leading-none shadow-[0_4px_18px_rgba(255,213,0,0.4)]"
            >
              <span className="text-base">{nextEvent.daysUntil}</span>
              <span className="text-[7px] font-mono tracking-widest mt-0.5">
                GG
              </span>
            </motion.span>

            <AnimatePresence>
              {eventHover && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-3 py-2 bg-bg border border-yellow font-mono text-[10px] uppercase tracking-widest text-yellow whitespace-nowrap pointer-events-none"
                >
                  Tra {nextEvent.daysUntil}{" "}
                  {nextEvent.daysUntil === 1 ? "giorno" : "giorni"} ·{" "}
                  {nextEvent.name}
                  <span className="absolute top-1/2 -right-1 w-2 h-2 bg-bg border-t border-r border-yellow -translate-y-1/2 rotate-45" />
                </motion.span>
              )}
            </AnimatePresence>
          </Link>

          {/* Separator between event teaser and social block */}
          <span className="w-6 h-px bg-yellow/30" />
        </>
      ) : null}

      <span className="flex flex-col items-center gap-3 mb-1 text-[10px] font-mono uppercase tracking-[0.3em] text-ink-faint">
        <span className="[writing-mode:vertical-rl] rotate-180">Social</span>
        <span className="w-px h-6 bg-ink-faint/60" />
      </span>

      {socials.map((s, i) => {
        const Icon = s.icon;
        const isHover = hovered === s.name;
        return (
          <motion.a
            key={s.name}
            href={s.url}
            target="_blank"
            rel="noreferrer"
            aria-label={s.name}
            data-cursor={s.name.toLowerCase()}
            onMouseEnter={() => setHovered(s.name)}
            onMouseLeave={() => setHovered(null)}
            className="group relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 1.3 + i * 0.08,
              duration: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Attention pulse ring on first load */}
            {attention && (
              <>
                <motion.span
                  initial={{ scale: 1, opacity: 0.5 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{
                    duration: 1.6,
                    repeat: Infinity,
                    delay: 1.4 + i * 0.2,
                    ease: "easeOut",
                  }}
                  className="absolute inset-0 rounded-full border border-yellow pointer-events-none"
                />
              </>
            )}

            {/* Glow backdrop on hover */}
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full blur-lg pointer-events-none"
              animate={{
                opacity: isHover ? 0.6 : 0,
                scale: isHover ? 1.4 : 1,
              }}
              transition={{ duration: 0.4 }}
              style={{ backgroundColor: s.color }}
            />

            {/* Icon container */}
            <motion.span
              animate={{ scale: isHover ? 1.12 : 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
              className="relative w-10 h-10 rounded-full border border-white/20 bg-bg/60 backdrop-blur-md flex items-center justify-center text-ink group-hover:border-yellow transition-colors"
            >
              <Icon className="w-[18px] h-[18px] group-hover:text-yellow transition-colors" />
            </motion.span>

            {/* Tooltip */}
            <AnimatePresence>
              {isHover && (
                <motion.span
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute right-[calc(100%+10px)] top-1/2 -translate-y-1/2 px-3 py-1.5 bg-bg border border-yellow/30 font-mono text-[10px] uppercase tracking-widest text-yellow whitespace-nowrap pointer-events-none"
                >
                  {s.name}
                  <span className="absolute top-1/2 -right-1 w-2 h-2 bg-bg border-t border-r border-yellow/30 -translate-y-1/2 rotate-45" />
                </motion.span>
              )}
            </AnimatePresence>
          </motion.a>
        );
      })}

      {/* Bottom decorative tick */}
      <span className="mt-1 w-px h-4 bg-gradient-to-b from-ink-faint to-transparent" />
    </motion.div>
  );
}

export function SocialFab({
  nextEvent = null,
}: {
  nextEvent?: NextEventTeaser | null;
}) {
  const [open, setOpen] = useState(false);
  const [attention, setAttention] = useState(true);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setAttention(false), 4000);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent | TouchEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    window.addEventListener("mousedown", handler);
    window.addEventListener("touchstart", handler);
    return () => {
      window.removeEventListener("mousedown", handler);
      window.removeEventListener("touchstart", handler);
    };
  }, [open]);

  if (socials.length === 0 && !nextEvent) return null;

  return (
    <div
      ref={ref}
      className="fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 md:hidden flex flex-col items-center gap-3"
    >
      {nextEvent && !open ? (
        <Link
          href="/eventi"
          aria-label={`Prossimo evento: ${nextEvent.name} tra ${nextEvent.daysUntil} giorni`}
          className="relative"
        >
          {/* Two staggered pulse rings, continuous */}
          <motion.span
            aria-hidden
            animate={{ scale: [1, 2.1], opacity: [0.55, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full border-2 border-yellow pointer-events-none"
          />
          <motion.span
            aria-hidden
            animate={{ scale: [1, 2.1], opacity: [0.55, 0] }}
            transition={{
              duration: 1.6,
              repeat: Infinity,
              ease: "easeOut",
              delay: 0.8,
            }}
            className="absolute inset-0 rounded-full border-2 border-yellow pointer-events-none"
          />
          <span className="relative w-12 h-12 rounded-full bg-yellow text-bg flex flex-col items-center justify-center font-display leading-none shadow-[0_6px_22px_rgba(255,213,0,0.45)]">
            <span className="text-lg">{nextEvent.daysUntil}</span>
            <span className="text-[8px] font-mono tracking-widest mt-0.5">
              GG
            </span>
          </span>
        </Link>
      ) : null}
      <AnimatePresence>
        {open && (
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {socials.map((s, i) => {
              const Icon = s.icon;
              return (
                <motion.a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.name}
                  initial={{ opacity: 0, y: 20, scale: 0.6 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.7 }}
                  transition={{
                    delay: i * 0.06,
                    type: "spring",
                    damping: 18,
                    stiffness: 260,
                  }}
                  className="relative"
                >
                  <span
                    aria-hidden
                    className="absolute inset-0 rounded-full blur-lg opacity-40"
                    style={{ backgroundColor: s.color }}
                  />
                  <span className="relative w-12 h-12 rounded-full border border-white/20 bg-bg/85 backdrop-blur-md flex items-center justify-center text-ink active:text-yellow active:border-yellow transition-colors">
                    <Icon className="w-5 h-5" />
                  </span>
                </motion.a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Chiudi social" : "Apri social"}
        aria-expanded={open}
        className="relative"
      >
        {attention && !open && (
          <motion.span
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.1, opacity: 0 }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: "easeOut",
            }}
            className="absolute inset-0 rounded-full border-2 border-yellow pointer-events-none"
          />
        )}
        <motion.span
          animate={{
            rotate: open ? 135 : 0,
            backgroundColor: open ? "#0a0a0a" : "#ffd500",
          }}
          transition={{ type: "spring", damping: 18, stiffness: 260 }}
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-[0_8px_28px_rgba(255,213,0,0.35)] border border-yellow/40"
        >
          {open ? (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffd500"
              strokeWidth="2"
              className="w-5 h-5"
              aria-hidden
            >
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#0a0a0a"
              strokeWidth="2"
              strokeLinecap="round"
              className="w-6 h-6"
              aria-hidden
            >
              <circle cx="18" cy="5" r="2.5" fill="#0a0a0a" />
              <circle cx="6" cy="12" r="2.5" fill="#0a0a0a" />
              <circle cx="18" cy="19" r="2.5" fill="#0a0a0a" />
              <line x1="8.2" y1="10.8" x2="15.8" y2="6.2" />
              <line x1="8.2" y1="13.2" x2="15.8" y2="17.8" />
            </svg>
          )}
        </motion.span>
      </button>
    </div>
  );
}
