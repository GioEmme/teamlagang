"use client";

import Image from "next/image";
import { Marquee } from "./Marquee";

export function SponsorsBanner({ logos }: { logos: string[] }) {
  if (!logos.length) return null;

  return (
    <div className="relative w-full bg-bg-soft border-y border-white/5 py-6 md:py-8 overflow-hidden">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 mb-4">
        <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-ink-faint">
          <span className="inline-block w-6 h-px bg-ink-faint align-middle mr-3" />
          I nostri sponsor
        </div>
      </div>

      <Marquee speed={40}>
        <div className="inline-flex items-center gap-10 md:gap-16 px-6 md:px-10">
          {logos.map((src) => (
            <div
              key={src}
              className="relative h-12 md:h-16 w-32 md:w-44 flex-none opacity-70 hover:opacity-100 transition-opacity"
            >
              <Image
                src={src}
                alt="Sponsor"
                fill
                sizes="(max-width: 768px) 128px, 176px"
                className="object-contain"
              />
            </div>
          ))}
        </div>
      </Marquee>
    </div>
  );
}
