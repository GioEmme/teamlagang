"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import type { ActiveBanner } from "@/lib/banners";

// Popup promozionale in sovrimpressione all'apertura del sito.
// "Una volta sola": alla chiusura un cookie lo tiene chiuso per un anno.
// "A ogni visita": resta chiuso solo per la sessione del browser, alla
// visita successiva riappare.
const ONE_YEAR = 60 * 60 * 24 * 365;

function closedKey(id: string) {
  return `tlg_banner_${id}`;
}

function wasClosed(b: ActiveBanner) {
  const key = closedKey(b.id);
  if (!b.showEveryVisit) {
    return document.cookie.split("; ").some((c) => c.startsWith(`${key}=`));
  }
  try {
    return sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function markClosed(b: ActiveBanner) {
  const key = closedKey(b.id);
  if (!b.showEveryVisit) {
    document.cookie = `${key}=1; Max-Age=${ONE_YEAR}; Path=/; SameSite=Lax`;
    return;
  }
  try {
    sessionStorage.setItem(key, "1");
  } catch {
    // storage bloccato: riapparirà alla prossima pagina, pazienza
  }
}

export function BannerPopup({ banner }: { banner: ActiveBanner | null }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!banner || wasClosed(banner)) return;
    const t = setTimeout(() => setOpen(true), 800);
    return () => clearTimeout(t);
  }, [banner]);

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    lenis?.stop();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
      lenis?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lenis]);

  function close() {
    if (banner) markClosed(banner);
    setOpen(false);
  }

  if (!banner) return null;
  const { title, caption, imageUrl, linkUrl } = banner;
  const external = linkUrl ? !linkUrl.startsWith("/") : false;
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="banner"
          role="dialog"
          aria-modal="true"
          aria-label={title ?? "Annuncio"}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-black/80 backdrop-blur-sm px-4 py-[max(1rem,env(safe-area-inset-top))]"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative my-auto w-full max-w-lg border border-white/10 bg-bg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              ref={closeRef}
              type="button"
              onClick={close}
              aria-label="Chiudi"
              className="absolute right-2 top-2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-bg/80 text-yellow ring-1 ring-yellow/50 backdrop-blur transition-colors hover:bg-yellow hover:text-bg"
            >
              <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
                <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </button>

            {imageUrl &&
              (linkUrl ? (
                <a href={linkUrl} {...linkProps} onClick={close} className="block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={title ?? ""}
                    className="block max-h-[70svh] w-full object-contain bg-black"
                  />
                </a>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={title ?? ""}
                  className="block max-h-[70svh] w-full object-contain bg-black"
                />
              ))}

            {(title || caption || linkUrl) && (
              <div className={`px-5 pb-5 ${imageUrl ? "pt-4" : "pt-14"}`}>
                {title && (
                  <h2 className="text-display text-2xl md:text-3xl leading-[0.95] text-ink">
                    {title}
                  </h2>
                )}
                {caption && (
                  <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-dim">
                    {caption}
                  </p>
                )}
                {linkUrl && (
                  <a
                    href={linkUrl}
                    {...linkProps}
                    onClick={close}
                    className="mt-4 inline-flex items-center gap-2 bg-yellow px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-bg transition-colors hover:bg-yellow-hot"
                  >
                    Scopri di più <span>→</span>
                  </a>
                )}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
