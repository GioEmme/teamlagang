"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "lenis/react";
import type { ActiveBanner } from "@/lib/banners";

// Popup promozionale in sovrimpressione all'apertura del sito.
// Più banner validi insieme → carosello con frecce ai lati.
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

export function BannerPopup({ banners }: { banners: ActiveBanner[] }) {
  const [items, setItems] = useState<ActiveBanner[]>([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);
  const closeRef = useRef<HTMLButtonElement>(null);
  // uno swipe non deve contare come clic sul link dell'immagine
  const dragged = useRef(false);
  const lenis = useLenis();

  useEffect(() => {
    const pending = banners.filter((b) => !wasClosed(b));
    if (pending.length === 0) return;
    const t = setTimeout(() => {
      setItems(pending);
      setIndex(0);
      setOpen(true);
    }, 800);
    return () => clearTimeout(t);
  }, [banners]);

  const many = items.length > 1;

  function go(step: number) {
    setDir(step);
    setIndex((i) => (i + step + items.length) % items.length);
  }

  function close() {
    items.forEach(markClosed);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    lenis?.stop();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (many && e.key === "ArrowRight") go(1);
      else if (many && e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
      lenis?.start();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, lenis, many]);

  const banner = items[index];

  return (
    <AnimatePresence>
      {open && banner && (
        <motion.div
          key="banner"
          role="dialog"
          aria-modal="true"
          aria-roledescription={many ? "carosello" : undefined}
          aria-label={banner.title ?? "Annuncio"}
          data-lenis-prevent
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto bg-black/80 backdrop-blur-sm px-4 py-[max(1rem,env(safe-area-inset-top))] md:px-20"
          onClick={close}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative my-auto w-full max-w-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative overflow-hidden border border-white/10 bg-bg shadow-2xl">
              <button
                ref={closeRef}
                type="button"
                onClick={close}
                aria-label="Chiudi"
                className="absolute right-2 top-2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-bg/80 text-yellow ring-1 ring-yellow/50 backdrop-blur transition-colors hover:bg-yellow hover:text-bg"
              >
                <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
                  <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </button>

              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.div
                  key={banner.id}
                  custom={dir}
                  variants={{
                    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
                    center: { x: 0, opacity: 1 },
                    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  drag={many ? "x" : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.2}
                  onPointerDown={() => (dragged.current = false)}
                  onDragStart={() => (dragged.current = true)}
                  onClickCapture={(e) => {
                    if (!dragged.current) return;
                    e.preventDefault();
                    e.stopPropagation();
                    dragged.current = false;
                  }}
                  onDragEnd={(_, info) => {
                    if (info.offset.x < -60) go(1);
                    else if (info.offset.x > 60) go(-1);
                  }}
                >
                  <Slide banner={banner} onNavigate={close} />
                </motion.div>
              </AnimatePresence>

              {many && (
                <div className="flex justify-center gap-2 pb-4">
                  {items.map((b, i) => (
                    <button
                      key={b.id}
                      type="button"
                      onClick={() => {
                        setDir(i > index ? 1 : -1);
                        setIndex(i);
                      }}
                      aria-label={`Annuncio ${i + 1} di ${items.length}`}
                      aria-current={i === index}
                      className={`h-1.5 rounded-full transition-all ${
                        i === index ? "w-6 bg-yellow" : "w-1.5 bg-white/30 hover:bg-white/60"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {many && (
              <>
                <Arrow side="left" onClick={() => go(-1)} />
                <Arrow side="right" onClick={() => go(1)} />
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Slide({
  banner,
  onNavigate,
}: {
  banner: ActiveBanner;
  onNavigate: () => void;
}) {
  const { title, caption, imageUrl, linkUrl } = banner;
  const external = linkUrl ? !linkUrl.startsWith("/") : false;
  const linkProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  const img = imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageUrl}
      alt={title ?? ""}
      draggable={false}
      className="block max-h-[70svh] w-full object-contain bg-black"
    />
  ) : null;

  return (
    <>
      {img &&
        (linkUrl ? (
          <a href={linkUrl} {...linkProps} onClick={onNavigate} draggable={false} className="block">
            {img}
          </a>
        ) : (
          img
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
              onClick={onNavigate}
              draggable={false}
              className="mt-4 inline-flex items-center gap-2 bg-yellow px-5 py-3 font-mono text-xs font-semibold uppercase tracking-widest text-bg transition-colors hover:bg-yellow-hot"
            >
              Scopri di più <span>→</span>
            </a>
          )}
        </div>
      )}
    </>
  );
}

// Frecce ai lati del riquadro: fuori su desktop, sul bordo su mobile.
function Arrow({ side, onClick }: { side: "left" | "right"; onClick: () => void }) {
  const left = side === "left";
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={left ? "Annuncio precedente" : "Annuncio successivo"}
      className={`absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-bg/80 text-yellow ring-1 ring-yellow/50 backdrop-blur transition-colors hover:bg-yellow hover:text-bg ${
        left ? "-left-3 md:-left-16" : "-right-3 md:-right-16"
      }`}
    >
      <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
        <path
          d={left ? "M11 3L5 9l6 6" : "M7 3l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="2.2"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
