"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Props = {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: () => void;
};

export function MagneticButton({
  children,
  className,
  strength = 0.3,
  onClick,
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { damping: 15, stiffness: 200 });
  const sy = useSpring(y, { damping: 15, stiffness: 200 });

  const onMove = (e: MouseEvent<HTMLButtonElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * strength);
    y.set((e.clientY - cy) * strength);
  };

  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      className={cn("inline-flex items-center", className)}
    >
      {children}
    </motion.button>
  );
}
