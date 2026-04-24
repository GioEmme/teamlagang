"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

const LAT = 44.6017075;
const LNG = 10.7024557;
const ADDRESS_LINE_1 = "Via Fratelli Rosselli 13";
const ADDRESS_LINE_2 = "42019 Scandiano (RE)";

export function LocationMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<unknown>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    let cancelled = false;

    (async () => {
      const L = (await import("leaflet")).default;
      if (cancelled || !containerRef.current) return;

      const map = L.map(containerRef.current, {
        center: [LAT, LNG],
        zoom: 15,
        scrollWheelZoom: false,
        zoomControl: true,
        attributionControl: true,
      });
      mapRef.current = map;

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OSM</a> · © <a href="https://carto.com/attributions" target="_blank" rel="noreferrer">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        },
      ).addTo(map);

      const icon = L.divIcon({
        className: "rc-marker",
        html: `
          <span class="rc-marker-pulse"></span>
          <span class="rc-marker-pulse rc-marker-pulse-2"></span>
          <span class="rc-marker-dot"></span>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
        popupAnchor: [0, -12],
      });

      const marker = L.marker([LAT, LNG], { icon }).addTo(map);
      marker
        .bindPopup(
          `<div class="rc-popup">
            <div class="rc-popup-label">RcLandia</div>
            <div class="rc-popup-addr">${ADDRESS_LINE_1}</div>
            <div class="rc-popup-addr2">${ADDRESS_LINE_2}</div>
          </div>`,
          { closeButton: false, offset: [0, -4] },
        )
        .openPopup();

      L.control
        .scale({ imperial: false, position: "bottomleft", maxWidth: 120 })
        .addTo(map);

      map.zoomControl.setPosition("bottomright");
    })();

    return () => {
      cancelled = true;
      if (mapRef.current) {
        (mapRef.current as { remove: () => void }).remove();
        mapRef.current = null;
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      className="relative w-full aspect-[16/11] bg-bg-soft border border-white/10 overflow-hidden"
    >
      <div ref={containerRef} className="absolute inset-0" />

      {/* Decorative overlays — all pointer-events-none so map stays interactive */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Viewport reticle — horizontal */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px">
          <div
            className="h-px w-full"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, rgba(255,213,0,0.35) 18%, transparent 45%, transparent 55%, rgba(255,213,0,0.35) 82%, transparent 100%)",
            }}
          />
        </div>
        {/* Viewport reticle — vertical */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px">
          <div
            className="w-px h-full"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(255,213,0,0.35) 18%, transparent 45%, transparent 55%, rgba(255,213,0,0.35) 82%, transparent 100%)",
            }}
          />
        </div>

        {/* Coordinates top-left */}
        <div className="absolute top-4 left-4 font-mono text-[10px] uppercase tracking-[0.2em] text-ink-dim bg-bg/60 backdrop-blur-sm px-2 py-1">
          <div>44.6017° N</div>
          <div>10.7025° E</div>
        </div>

        {/* Compass top-right */}
        <div className="absolute top-4 right-4 flex flex-col items-center gap-1 bg-bg/60 backdrop-blur-sm px-2 py-1.5">
          <svg
            viewBox="0 0 24 24"
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden
          >
            <circle cx="12" cy="12" r="10" className="text-ink-faint" />
            <path
              d="M12 3 L15 13 L12 11 L9 13 Z"
              fill="currentColor"
              className="text-yellow"
              stroke="none"
            />
            <path
              d="M12 21 L15 11 L12 13 L9 11 Z"
              className="text-ink-faint"
              fill="currentColor"
              stroke="none"
              opacity="0.4"
            />
          </svg>
          <span className="font-mono text-[9px] uppercase tracking-widest text-ink-faint">
            N
          </span>
        </div>

        {/* Corner brackets */}
        <CornerBracket className="top-0 left-0" />
        <CornerBracket className="top-0 right-0 rotate-90" />
        <CornerBracket className="bottom-0 right-0 rotate-180" />
        <CornerBracket className="bottom-0 left-0 -rotate-90" />
      </div>
    </motion.div>
  );
}

function CornerBracket({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`absolute w-6 h-6 text-yellow/70 ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      aria-hidden
    >
      <path d="M 2 10 L 2 2 L 10 2" />
    </svg>
  );
}
