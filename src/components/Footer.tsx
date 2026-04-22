import Link from "next/link";
import Image from "next/image";
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="relative bg-bg border-t border-white/5 overflow-hidden">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-yellow to-transparent" />

      <div className="mx-auto max-w-[1600px] px-5 md:px-10 pt-20 md:pt-32 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-6">
          <div className="md:col-span-5">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-16 h-16 rounded-full overflow-hidden bg-black">
                <Image
                  src="/teamlagang-logo.png"
                  alt="Team La Gang"
                  fill
                  sizes="64px"
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-display text-2xl">Team La Gang</span>
                <span className="text-xs text-ink-dim font-mono uppercase tracking-widest">
                  Associazione Sportiva
                </span>
              </div>
            </div>
            <p className="text-ink-dim max-w-sm leading-relaxed">
              {site.description}
            </p>
            <div className="mt-6 relative w-48 h-10">
              <Image
                src="/rclandia-logo.png"
                alt="RcLandia"
                fill
                sizes="192px"
                className="object-contain object-left"
              />
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-7">
            <h4 className="text-xs uppercase tracking-widest font-mono text-ink-faint mb-4">
              Sito
            </h4>
            <ul className="space-y-2">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-ink hover:text-yellow transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-xs uppercase tracking-widest font-mono text-ink-faint mb-4">
              Social
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href={site.social.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink hover:text-yellow transition-colors"
                >
                  Instagram
                </a>
              </li>
              <li>
                <a
                  href={site.social.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink hover:text-yellow transition-colors"
                >
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={site.social.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="text-ink hover:text-yellow transition-colors"
                >
                  YouTube
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-20 md:mt-28 select-none">
          <h2 className="text-display text-[clamp(4rem,18vw,22rem)] leading-none text-transparent [-webkit-text-stroke:1px_#2a2a2a] md:[-webkit-text-stroke:2px_#2a2a2a]">
            RCLANDIA
          </h2>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center text-xs font-mono text-ink-faint uppercase tracking-widest">
          <div>
            © {new Date().getFullYear()} A.S. Team La Gang · {site.domain}
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-yellow">
              Privacy
            </Link>
            <Link href="/cookie" className="hover:text-yellow">
              Cookie
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
