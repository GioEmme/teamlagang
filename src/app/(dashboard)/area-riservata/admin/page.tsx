import type { Metadata } from "next";
import Link from "next/link";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { news, users } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminHome() {
  const [newsCount] = await db
    .select({
      total: sql<number>`count(*)::int`,
      drafts: sql<number>`count(*) filter (where ${news.publishedAt} is null)::int`,
      published: sql<number>`count(*) filter (where ${news.publishedAt} is not null)::int`,
    })
    .from(news);

  const [userCount] = await db
    .select({ total: sql<number>`count(*)::int` })
    .from(users);

  return (
    <section className="mx-auto max-w-5xl px-5 md:px-10 py-16 md:py-24">
      <div className="font-mono text-xs uppercase tracking-[0.3em] text-yellow mb-3">
        Amministrazione
      </div>
      <h1 className="text-display text-[clamp(3rem,9vw,7rem)] leading-[0.9] mb-12 md:mb-16">
        Pannello.
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-14">
        <Stat label="News totali" value={newsCount.total} />
        <Stat label="Pubblicate" value={newsCount.published} accent />
        <Stat label="Bozze" value={newsCount.drafts} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <AdminCard
          href="/area-riservata/admin/news"
          title="Gestisci news"
          description="Crea, modifica, pubblica o archivia articoli."
          meta={`${newsCount.total} articoli`}
        />
        <AdminCard
          href="#"
          title="Utenti"
          description="Presto: gestione soci, promozione admin, disattivazione."
          meta={`${userCount.total} registrati`}
          disabled
        />
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: boolean;
}) {
  return (
    <div className="border border-white/10 bg-bg-soft px-5 py-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-2">
        {label}
      </div>
      <div
        className={`text-display text-5xl ${accent ? "text-yellow" : "text-ink"}`}
      >
        {value}
      </div>
    </div>
  );
}

function AdminCard({
  href,
  title,
  description,
  meta,
  disabled,
}: {
  href: string;
  title: string;
  description: string;
  meta: string;
  disabled?: boolean;
}) {
  const body = (
    <>
      <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-ink-faint mb-2">
        {meta}
      </div>
      <h3 className="text-display text-2xl mb-2">{title}</h3>
      <p className="text-sm text-ink-dim leading-relaxed">{description}</p>
      {!disabled && (
        <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-yellow">
          Apri →
        </div>
      )}
    </>
  );

  if (disabled) {
    return (
      <div className="block border border-dashed border-white/10 bg-bg-soft/30 p-6 opacity-60 cursor-not-allowed">
        {body}
      </div>
    );
  }

  return (
    <Link
      href={href}
      className="block border border-white/10 bg-bg-soft p-6 hover:border-yellow transition-colors"
    >
      {body}
    </Link>
  );
}
