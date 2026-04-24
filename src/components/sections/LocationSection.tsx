"use client";

import { motion } from "framer-motion";
import { useRef } from "react";
import { LocationMap } from "./LocationMap";

const MAPS_URL =
  "https://www.google.com/maps/dir/?api=1&destination=Via+Fratelli+Rosselli+13%2C+42019+Scandiano+RE+Italia";

export function LocationSection() {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <section
      ref={ref}
      className="relative py-24 md:py-32 bg-bg overflow-hidden"
    >
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow/30 to-transparent" />

      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-6"
        >
          07 · Dove siamo
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="text-display text-[clamp(2.75rem,8vw,7rem)] leading-[0.9] mb-12 md:mb-20"
        >
          Scandiano.
          <span className="block text-yellow">Reggio Emilia.</span>
        </motion.h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-stretch">
          {/* MAP — 2/3 */}
          <div className="lg:col-span-2">
            <LocationMap />
          </div>

          {/* TRAVEL INFO — 1/3 */}
          <div className="lg:col-span-1 flex flex-col justify-between">
            <div>
              <div className="font-mono text-xs uppercase tracking-[0.3em] text-yellow mb-4">
                Come raggiungerci
              </div>
              <p className="text-ink-dim text-sm leading-relaxed mb-8">
                Facile da raggiungere dalle principali direttrici del nord
                Italia. Parcheggio gratuito davanti alla struttura.
              </p>
            </div>

            <div className="space-y-6">
              <TravelRow
                delay={0}
                icon={<CarIcon />}
                title="In auto"
                body="Autostrada A1 Milano–Napoli. Uscita Reggio Emilia o Modena Nord, poi ~15 min verso Scandiano. Parcheggio davanti alla pista."
              />
              <TravelRow
                delay={0.08}
                icon={<TrainIcon />}
                title="In treno"
                body="Stazione AV Reggio Emilia Mediopadana a ~25 min. Linea regionale Reggio Emilia–Sassuolo con fermata Scandiano."
              />
              <TravelRow
                delay={0.16}
                icon={<PlaneIcon />}
                title="In aereo"
                body="Bologna Marconi (~55 min auto). Milano Linate e Verona Catullo entrambi in ~1h30."
              />
            </div>

            <a
              href={MAPS_URL}
              target="_blank"
              rel="noreferrer"
              data-cursor="go"
              className="group mt-10 inline-flex items-center gap-3 px-6 py-3 bg-yellow text-bg font-mono text-xs uppercase tracking-widest font-semibold hover:bg-yellow-hot transition-colors self-start"
            >
              Indicazioni stradali <span className="group-hover:translate-x-1 transition-transform">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function TravelRow({
  icon,
  title,
  body,
  delay = 0,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="border-t border-white/10 pt-5"
    >
      <div className="flex items-start gap-4">
        <div className="flex-none w-10 h-10 border border-yellow/40 flex items-center justify-center text-yellow">
          {icon}
        </div>
        <div className="flex-1">
          <div className="font-mono text-xs uppercase tracking-[0.2em] text-ink mb-1.5">
            {title}
          </div>
          <p className="text-sm text-ink-dim leading-relaxed">{body}</p>
        </div>
      </div>
    </motion.div>
  );
}

function CarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden
    >
      <path d="M4 14 L5.5 9 H18.5 L20 14" />
      <rect x="3" y="14" width="18" height="5" rx="1" />
      <circle cx="7" cy="19" r="1.5" fill="currentColor" />
      <circle cx="17" cy="19" r="1.5" fill="currentColor" />
    </svg>
  );
}

function TrainIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden
    >
      <rect x="5" y="3" width="14" height="14" rx="3" />
      <line x1="5" y1="10" x2="19" y2="10" />
      <circle cx="9" cy="13.5" r="1" fill="currentColor" />
      <circle cx="15" cy="13.5" r="1" fill="currentColor" />
      <path d="M7 17 L5 21" />
      <path d="M17 17 L19 21" />
    </svg>
  );
}

function PlaneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-5 h-5"
      aria-hidden
    >
      <path d="M12 2.5 L12.9 5 L12.9 9.2 L21 13 L21 14.6 L12.9 12.6 L12.9 17.2 L14.7 18.7 L14.7 20 L12 19 L9.3 20 L9.3 18.7 L11.1 17.2 L11.1 12.6 L3 14.6 L3 13 L11.1 9.2 L11.1 5 Z" />
    </svg>
  );
}
