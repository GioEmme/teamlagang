"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);

  const springConfig = { damping: 30, stiffness: 400, mass: 0.5 };
  const dotX = useSpring(x, { damping: 40, stiffness: 800, mass: 0.3 });
  const dotY = useSpring(y, { damping: 40, stiffness: 800, mass: 0.3 });
  const ringX = useSpring(x, springConfig);
  const ringY = useSpring(y, springConfig);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setEnabled(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove("has-custom-cursor");
      return;
    }
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>(
        "[data-cursor]",
      );
      if (el) {
        setHover(true);
        setLabel(el.dataset.cursor || null);
      } else {
        setHover(false);
        setLabel(null);
      }
    };

    window.addEventListener("mousemove", move, { passive: true });
    window.addEventListener("mouseover", over);
    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseover", over);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <>
      <motion.div
        aria-hidden
        className="fixed left-0 top-0 z-[999] pointer-events-none mix-blend-difference"
        style={{ x: dotX, y: dotY }}
      >
        <div className="-translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white" />
      </motion.div>
      <motion.div
        aria-hidden
        className="fixed left-0 top-0 z-[998] pointer-events-none"
        style={{ x: ringX, y: ringY }}
      >
        <motion.div
          animate={{
            scale: hover ? 2.2 : 1,
            borderColor: hover ? "#ffd500" : "rgba(255,255,255,0.5)",
          }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="-translate-x-1/2 -translate-y-1/2 w-9 h-9 rounded-full border-2 flex items-center justify-center"
        >
          {label && (
            <span className="text-[10px] uppercase tracking-widest text-yellow font-mono">
              {label}
            </span>
          )}
        </motion.div>
      </motion.div>
    </>
  );
}
