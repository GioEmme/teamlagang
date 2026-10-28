"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLenis } from "lenis/react";

// Bottone "Leggi il report" che apre la pagina statica del report
// (public/articoli/...) in un overlay a tutto schermo con un iframe.
// Senza JS, o con Cmd/Ctrl-click, resta un normale link.
export function ReportModal({
  href,
  title,
  className,
  children,
}: {
  href: string;
  title: string;
  className?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    if (!open) return;
    const html = document.documentElement;
    const prevOverflow = html.style.overflow;
    html.style.overflow = "hidden";
    lenis?.stop();
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      html.style.overflow = prevOverflow;
      lenis?.start();
      triggerRef.current?.focus();
    };
  }, [open, lenis]);

  return (
    <>
      <a
        ref={triggerRef}
        href={href}
        className={className}
        onClick={(e) => {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
          e.preventDefault();
          setOpen(true);
        }}
      >
        {children}
      </a>
      {open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={title}
              data-lenis-prevent
              className="fixed inset-0 z-[1000] flex items-stretch justify-center bg-black/80 backdrop-blur-sm md:p-6"
              onClick={() => setOpen(false)}
            >
              <div
                className="flex w-full max-w-5xl flex-col overflow-hidden bg-bg md:rounded-md md:border md:border-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex h-12 flex-none items-center justify-between gap-3 border-b border-white/10 bg-bg pl-4 pr-1.5 pt-[env(safe-area-inset-top)] box-content">
                  <span className="min-w-0 truncate font-mono text-[11px] uppercase tracking-widest text-ink-dim">
                    {title}
                  </span>
                  <button
                    ref={closeRef}
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Chiudi il report"
                    className="flex h-10 w-10 flex-none items-center justify-center rounded-full text-yellow ring-1 ring-yellow/50 transition-colors hover:bg-yellow hover:text-bg"
                  >
                    <svg width="16" height="16" viewBox="0 0 18 18" aria-hidden="true">
                      <path d="M3 3l12 12M15 3L3 15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
                <iframe
                  src={href}
                  title={title}
                  className="min-h-0 w-full flex-1 border-0 bg-bg"
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
