"use client";

import { usePathname } from "next/navigation";

const AUTH_PREFIXES = [
  "/login",
  "/registrazione",
  "/verifica",
  "/password-dimenticata",
  "/password-reset",
  "/area-riservata",
];

export function SiteChrome({
  children,
  nav,
  rails,
  footer,
}: {
  children: React.ReactNode;
  nav: React.ReactNode;
  rails: React.ReactNode;
  footer: React.ReactNode;
}) {
  const pathname = usePathname();
  const bare = AUTH_PREFIXES.some((p) => pathname?.startsWith(p));

  if (bare) {
    return <main className="relative min-h-screen">{children}</main>;
  }

  return (
    <>
      {nav}
      {rails}
      <main className="relative">{children}</main>
      {footer}
    </>
  );
}
