import type { Metadata } from "next";
import Link from "next/link";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db/client";
import { banners } from "@/lib/db/schema";

export const metadata: Metadata = {
  title: "Admin · Banner",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const fmt = (d: Date) =>
  new Date(d).toLocaleString("it-IT", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Rome",
  });

export default async function AdminBannerList() {
  const rows = await db.select().from(banners).orderBy(desc(banners.updatedAt));
  const now = new Date();

  return (
    <section className="mx-auto max-w-6xl px-5 md:px-10 py-16 md:py-24">
      <div className="flex items-start justify-between gap-6 mb-12">
        <div>
          <div className="font-mono text-xs uppercase tracking-[0.3em] text-yellow mb-3">
            Admin · Banner
          </div>
          <h1 className="text-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.9]">
            Banner.
          </h1>
        </div>
        <Link
          href="/area-riservata/admin/banner/nuovo"
          className="whitespace-nowrap px-5 py-3 bg-yellow text-bg font-mono text-xs uppercase tracking-widest font-semibold hover:bg-yellow-hot transition-colors"
        >
          + Nuovo
        </Link>
      </div>

      {rows.length === 0 ? (
        <div className="border border-dashed border-white/10 px-6 py-16 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ink-faint">
            Nessun banner. Crea il primo →
          </p>
        </div>
      ) : (
        <div className="border border-white/10 divide-y divide-white/10">
          {rows.map((r) => {
            const expired = new Date(r.endsAt) <= now;
            const future = new Date(r.startsAt) > now;
            const state = !r.active
              ? "Spento"
              : expired
                ? "Scaduto"
                : future
                  ? "Programmato"
                  : "Attivo";
            const live = state === "Attivo";
            return (
              <Link
                key={r.id}
                href={`/area-riservata/admin/banner/${r.id}`}
                className="flex items-center gap-4 px-4 md:px-6 py-4 hover:bg-bg-elev transition-colors group"
              >
                {r.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={r.imageUrl}
                    alt=""
                    className="flex-none h-12 w-12 object-cover border border-white/10"
                  />
                ) : (
                  <div className="flex-none h-12 w-12 border border-dashed border-white/10" />
                )}
                <span
                  className={`flex-none font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 ${
                    live ? "bg-yellow text-bg" : "border border-white/20 text-ink-dim"
                  }`}
                >
                  {state}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-ink truncate group-hover:text-yellow transition-colors">
                    {r.title || "(senza titolo)"}
                  </div>
                  <div className="font-mono text-[10px] uppercase tracking-widest text-ink-faint mt-1">
                    {r.showEveryVisit ? "A ogni visita" : "Una volta sola"}
                    {` · ${fmt(r.startsAt)} → ${fmt(r.endsAt)}`}
                  </div>
                </div>
                <span className="flex-none font-mono text-[10px] uppercase tracking-widest text-yellow opacity-0 group-hover:opacity-100 transition-opacity">
                  →
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
