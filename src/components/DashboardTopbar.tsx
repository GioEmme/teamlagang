"use client";

import Link from "next/link";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";

export function DashboardTopbar({
  firstName,
  lastName,
  role,
}: {
  firstName: string;
  lastName: string;
  role: "admin" | "member";
}) {
  const isAdmin = role === "admin";
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-bg/90 backdrop-blur-md border-b border-white/10">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10 h-16 flex items-center gap-6">
        <Link
          href="/area-riservata"
          data-cursor="box"
          className="flex items-center gap-3"
        >
          <div className="relative w-9 h-9 rounded-full overflow-hidden bg-black">
            <Image
              src="/teamlagang-logo.png"
              alt="Team La Gang"
              fill
              sizes="36px"
              className="object-contain"
            />
          </div>
          <span className="hidden md:block font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint">
            Box personale
          </span>
        </Link>

        <div className="flex items-center gap-1 md:gap-2 pl-3 md:pl-4 ml-1 md:ml-2 border-l border-white/10">
          <Link
            href="/"
            data-cursor="home"
            className="px-2 md:px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-dim hover:text-yellow transition-colors"
          >
            ← Sito
          </Link>
          <span className="hidden lg:flex items-center gap-1">
            <Link
              href="/pista"
              data-cursor="vai"
              className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-dim hover:text-ink transition-colors"
            >
              Pista
            </Link>
            <Link
              href="/news"
              data-cursor="vai"
              className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-dim hover:text-ink transition-colors"
            >
              News
            </Link>
            <Link
              href="/contatti"
              data-cursor="vai"
              className="px-2 py-1.5 font-mono text-[10px] uppercase tracking-widest text-ink-dim hover:text-ink transition-colors"
            >
              Contatti
            </Link>
          </span>
        </div>

        <nav className="ml-auto flex items-center gap-1 md:gap-3">
          <NavLink
            href="/area-riservata"
            active={pathname === "/area-riservata"}
            cursor="box"
          >
            Home
          </NavLink>
          <NavLink
            href="/area-riservata/profilo"
            active={pathname?.startsWith("/area-riservata/profilo") ?? false}
            cursor="profilo"
          >
            Profilo
          </NavLink>
          {isAdmin && (
            <NavLink
              href="/area-riservata/admin"
              active={pathname?.startsWith("/area-riservata/admin") ?? false}
              cursor="admin"
            >
              Admin
            </NavLink>
          )}
        </nav>

        <div className="hidden md:flex items-center gap-3 pl-4 ml-2 border-l border-white/10">
          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-dim">
            {firstName} {lastName}
          </span>
          {isAdmin && (
            <span className="font-mono text-[9px] uppercase tracking-widest text-bg bg-yellow px-1.5 py-0.5">
              Admin
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          data-cursor="esci"
          className="px-3 py-1.5 border border-white/15 font-mono text-[10px] uppercase tracking-widest text-ink hover:border-yellow hover:text-yellow transition-colors"
        >
          Logout
        </button>
      </div>
    </header>
  );
}

function NavLink({
  href,
  active,
  children,
  cursor,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
  cursor?: string;
}) {
  return (
    <Link
      href={href}
      data-cursor={cursor}
      className={cn(
        "px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors",
        active ? "text-yellow" : "text-ink-dim hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
