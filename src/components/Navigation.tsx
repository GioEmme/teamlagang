"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { site } from "@/lib/site";
import { cn } from "@/lib/cn";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const check = () => {
      const sentinel = document.getElementById("hero-sentinel");
      if (sentinel) {
        setScrolled(sentinel.getBoundingClientRect().top <= 0);
      } else {
        setScrolled(window.scrollY > 40);
      }
    };
    check();
    window.addEventListener("scroll", check, { passive: true });
    window.addEventListener("resize", check, { passive: true });
    return () => {
      window.removeEventListener("scroll", check);
      window.removeEventListener("resize", check);
    };
  }, [pathname]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled || open
            ? "bg-bg/80 backdrop-blur-lg border-b border-white/5"
            : "bg-transparent",
        )}
      >
        <div className="mx-auto max-w-[1600px] px-5 md:px-10 h-16 md:h-20 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 group"
            data-cursor="home"
          >
            <div className="relative w-10 h-10 md:w-12 md:h-12">
              <Image
                src="/teamlagang-logo.png"
                alt="Team La Gang"
                fill
                sizes="48px"
                style={{ mixBlendMode: "screen" }}
                className="object-contain transition-transform duration-500 group-hover:rotate-12"
              />
            </div>
            <div className="hidden sm:flex flex-col leading-none gap-1.5">
              <span className="text-display text-lg md:text-xl text-ink">
                Team La Gang
              </span>
              <span className="text-[10px] md:text-[11px] text-ink-dim uppercase tracking-[0.2em] font-mono">
                RcLandia · Pista indoor
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {site.nav.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  data-cursor="vai"
                  className={cn(
                    "relative px-4 py-2 text-sm uppercase tracking-widest font-mono transition-colors",
                    active ? "text-yellow" : "text-ink hover:text-yellow",
                  )}
                >
                  {item.label}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute left-1/2 -bottom-0.5 w-1 h-1 bg-yellow rounded-full -translate-x-1/2"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contatti"
              data-cursor="iscriviti"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-yellow text-bg text-xs uppercase tracking-widest font-mono font-semibold hover:bg-yellow-hot transition-colors"
            >
              Tesseramento
              <span aria-hidden>→</span>
            </Link>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Chiudi menu" : "Apri menu"}
              data-cursor={open ? "chiudi" : "menu"}
              className="lg:hidden relative w-10 h-10 flex items-center justify-center"
            >
              <span
                className={cn(
                  "absolute left-2 right-2 h-[2px] bg-ink transition-all duration-300",
                  open ? "rotate-45" : "-translate-y-1.5",
                )}
              />
              <span
                className={cn(
                  "absolute left-2 right-2 h-[2px] bg-ink transition-all duration-300",
                  open && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-2 right-2 h-[2px] bg-ink transition-all duration-300",
                  open ? "-rotate-45" : "translate-y-1.5",
                )}
              />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-xl lg:hidden pt-20 px-6"
          >
            <nav className="flex flex-col pt-4">
              {site.nav.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i, ease: [0.16, 1, 0.3, 1] }}
                  className="border-b border-white/10"
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between py-5 text-display text-4xl",
                      pathname === item.href ? "text-yellow" : "text-ink",
                    )}
                  >
                    {item.label}
                    <span className="text-ink-dim font-mono text-xs">
                      0{i + 1}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10"
              >
                <Link
                  href="/contatti"
                  className="block w-full text-center py-4 bg-yellow text-bg text-lg uppercase tracking-widest font-display"
                >
                  Tesseramento
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
