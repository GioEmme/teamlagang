"use client";

import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function Marquee({
  children,
  className,
  reverse = false,
  speed = 30,
}: {
  children: ReactNode;
  className?: string;
  reverse?: boolean;
  speed?: number;
}) {
  return (
    <div className={cn("overflow-hidden whitespace-nowrap", className)}>
      <div
        className="inline-flex animate-marquee"
        style={{
          animationDuration: `${speed}s`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <div className="inline-flex shrink-0">{children}</div>
        <div className="inline-flex shrink-0" aria-hidden>
          {children}
        </div>
      </div>
    </div>
  );
}
