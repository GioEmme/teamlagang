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
        <Link href="/area-riservata" className="flex items-center gap-3">
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
            Area riservata
          </span>
        </Link>

        <nav className="ml-auto flex items-center gap-1 md:gap-3">
          <NavLink href="/area-riservata" active={pathname === "/area-riservata"}>
            Home
          </NavLink>
          <NavLink
            href="/area-riservata/profilo"
            active={pathname?.startsWith("/area-riservata/profilo") ?? false}
          >
            Profilo
          </NavLink>
          {isAdmin && (
            <NavLink
              href="/area-riservata/admin"
              active={pathname?.startsWith("/area-riservata/admin") ?? false}
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
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "px-3 py-1.5 font-mono text-[10px] uppercase tracking-widest transition-colors",
        active ? "text-yellow" : "text-ink-dim hover:text-ink",
      )}
    >
      {children}
    </Link>
  );
}
