import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import {
  buildMyrcmEventUrl,
  buildResultsLookup,
  getIisCategories,
  getIisSeasons,
  getIisStandings,
  getLatestEvents,
  pickRoundWinners,
} from "@/lib/myrcm";

export const metadata: Metadata = {
  title: "Eventi",
  description: "Calendario gare e classifiche Italian Indoor Series a RcLandia.",
};

export const dynamic = "force-dynamic";

type Search = Promise<{ season?: string; cat?: string }>;

function fmtDate(d: Date | string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function buildHref(season: string | undefined, cat: string | undefined) {
  const sp = new URLSearchParams();
  if (season) sp.set("season", season);
  if (cat) sp.set("cat", cat);
  return `/eventi?${sp.toString()}#classifiche`;
}

export default async function EventiPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  const params = await searchParams;

  const [latest, seasons] = await Promise.all([
    getLatestEvents(10),
    getIisSeasons(),
  ]);

  const today = new Date();
  const todayIso = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
  const dateFieldToIso = (v: string | Date | null) => {
    if (!v) return null;
    if (typeof v === "string") return v.slice(0, 10);
    // Date column is TZ-naive in PG; use local components to preserve the day.
    return `${v.getFullYear()}-${String(v.getMonth() + 1).padStart(2, "0")}-${String(v.getDate()).padStart(2, "0")}`;
  };
  const isPast = (e: (typeof latest)[number]) => {
    const ref = dateFieldToIso(e.endDate ?? e.startDate);
    return ref !== null && ref < todayIso;
  };

  const selectedSeason = params.season ?? seasons[0]?.key ?? null;
  const categories = selectedSeason ? await getIisCategories(selectedSeason) : [];
  const selectedCategory = params.cat ?? categories[0] ?? null;
  const standings =
    selectedSeason && selectedCategory
      ? await getIisStandings(selectedSeason, selectedCategory)
      : null;
  const winners = standings ? pickRoundWinners(standings) : [];
  const lookup = standings ? buildResultsLookup(standings) : new Map();

  return (
    <>
      <PageHero
        index="04"
        label="Eventi"
        title="Calendario"
        accent="& classifiche."
        color="yellow"
        subtitle="Trofei, open day, gare monomarca e Italian Indoor Series. Dati sincronizzati direttamente da myrcm.ch."
      />

      {/* ----------- CALENDARIO (ultime 10 gare pianificate) ----------- */}
      <section className="relative py-20 md:py-32 bg-bg-soft">
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
              Calendario · ultime 10 gare pianificate
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.9] mb-12 md:mb-16">
              Sul <span className="text-yellow">circuito.</span>
            </h2>
          </Reveal>

          {latest.length === 0 ? (
            <Reveal>
              <div className="border border-dashed border-yellow/30 bg-yellow/5 px-6 py-16 md:py-20 text-center">
                <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow mb-4">
                  Stagione 2026/27
                </div>
                <p className="text-display text-2xl md:text-4xl text-ink leading-tight max-w-2xl mx-auto">
                  Calendario stagione 2026/2027
                  <br />
                  <span className="text-yellow">in preparazione…</span>
                </p>
                <p className="mt-6 text-sm font-mono uppercase tracking-widest text-ink-faint">
                  Date e categorie verranno pubblicate qui appena confermate.
                </p>
              </div>
            </Reveal>
          ) : (
            <div className="divide-y divide-white/10 border-y border-white/10">
              {latest.map((e) => {
                const past = isPast(e);
                const regOpen = e.registrationStatus === "open" && !past;
                return (
                  <Reveal key={e.myrcmId}>
                    <div className="grid grid-cols-12 gap-4 py-6 md:py-8 px-2 md:px-4 hover:bg-bg-elev transition-colors">
                      <div className="col-span-12 md:col-span-2 flex md:flex-col gap-3 md:gap-2 items-center md:items-start">
                        <span
                          className={
                            "inline-flex items-center font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 border " +
                            (past
                              ? "text-ink-faint border-white/15 bg-white/[0.02]"
                              : "text-yellow border-yellow/40 bg-yellow/5")
                          }
                        >
                          {past ? "Disputato" : "In arrivo"}
                        </span>
                        <time
                          className={
                            "font-mono text-sm " +
                            (past ? "text-ink-dim" : "text-yellow")
                          }
                        >
                          {fmtDate(e.startDate)}
                        </time>
                      </div>
                      <div className="col-span-12 md:col-span-7">
                        <div
                          className={
                            "text-display text-2xl md:text-3xl leading-tight " +
                            (past ? "text-ink-dim" : "text-ink")
                          }
                        >
                          {e.name}
                        </div>
                        {e.endDate && e.endDate !== e.startDate ? (
                          <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-ink-faint">
                            fino al {fmtDate(e.endDate)}
                          </div>
                        ) : null}
                      </div>
                      <div className="col-span-12 md:col-span-3 flex flex-col md:items-end gap-2 self-center">
                        <div className="font-mono text-xs uppercase tracking-widest text-ink-dim text-left md:text-right">
                          {e.registeredCount} iscritti
                          {e.waitingCount > 0 ? (
                            <span className="text-ink-faint">
                              {" "}
                              · {e.waitingCount} in attesa
                            </span>
                          ) : null}
                        </div>
                        {regOpen ? (
                          <a
                            href={buildMyrcmEventUrl(e.myrcmId)}
                            target="_blank"
                            rel="noopener noreferrer"
                            data-cursor="iscriviti"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-yellow text-bg font-mono text-[10px] uppercase tracking-widest font-semibold hover:bg-yellow-hot transition-colors"
                          >
                            Iscriviti su myrcm <span>→</span>
                          </a>
                        ) : !past && e.registrationStatus === "scheduled" ? (
                          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                            Iscrizioni in apertura
                          </span>
                        ) : !past && e.registrationStatus === "closed" ? (
                          <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                            Iscrizioni chiuse
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ----------- ITALIAN INDOOR SERIES — CLASSIFICHE ----------- */}
      <section
        id="classifiche"
        className="relative py-20 md:py-32 bg-bg scroll-mt-24"
      >
        <div className="mx-auto max-w-[1600px] px-5 md:px-10">
          <Reveal>
            <div className="font-mono text-xs uppercase tracking-[0.3em] text-ink-faint mb-4">
              Italian Indoor Series · Classifiche
            </div>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-display text-[clamp(2.5rem,7vw,7rem)] leading-[0.9]">
              Chi tira il <span className="text-red">decimo.</span>
            </h2>
          </Reveal>

          {seasons.length === 0 ? (
            <Reveal delay={0.1}>
              <p className="mt-12 text-ink-dim font-mono text-sm uppercase tracking-widest">
                Nessuna classifica disponibile.
              </p>
            </Reveal>
          ) : (
            <>
              {/* Season chips */}
              <Reveal delay={0.1}>
                <div className="mt-12 flex flex-wrap gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint self-center mr-2">
                    Stagione
                  </span>
                  {seasons.map((s) => {
                    const active = s.key === selectedSeason;
                    return (
                      <Link
                        key={s.key}
                        href={buildHref(s.key, undefined)}
                        scroll={false}
                        className={
                          "px-3 py-2 font-mono text-[11px] uppercase tracking-widest border transition-colors " +
                          (active
                            ? "bg-red/15 border-red text-red"
                            : "border-white/15 text-ink-dim hover:border-white/40 hover:text-ink")
                        }
                      >
                        {s.key.replace(/^CAMPIONATO\s+/i, "")}
                      </Link>
                    );
                  })}
                </div>
              </Reveal>

              {/* Category chips */}
              {categories.length > 0 ? (
                <Reveal delay={0.15}>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-widest text-ink-faint self-center mr-2">
                      Categoria
                    </span>
                    {categories.map((c) => {
                      const active = c === selectedCategory;
                      return (
                        <Link
                          key={c}
                          href={buildHref(selectedSeason ?? undefined, c)}
                          scroll={false}
                          className={
                            "px-3 py-2 font-mono text-[11px] uppercase tracking-widest border transition-colors " +
                            (active
                              ? "bg-yellow/15 border-yellow text-yellow"
                              : "border-white/15 text-ink-dim hover:border-white/40 hover:text-ink")
                          }
                        >
                          {c}
                        </Link>
                      );
                    })}
                  </div>
                </Reveal>
              ) : null}

              {/* Winners by round */}
              {winners.length > 0 && winners.some((w) => w !== null) ? (
                <Reveal delay={0.2}>
                  <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                    {winners.map((w, i) => (
                      <div
                        key={i}
                        className="bg-bg-elev border border-white/10 p-4"
                      >
                        <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-yellow mb-2">
                          Round {i + 1}
                        </div>
                        {w ? (
                          <>
                            <div className="text-display text-lg leading-tight">
                              {w.pilotName}
                            </div>
                            <div className="mt-2 font-mono text-[10px] uppercase tracking-widest text-ink-dim">
                              {w.points} pti
                              {w.tqFlag ? (
                                <span className="text-yellow"> · TQ</span>
                              ) : null}
                            </div>
                          </>
                        ) : (
                          <div className="font-mono text-[11px] text-ink-faint uppercase tracking-widest">
                            Non disputato
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Reveal>
              ) : null}

              {/* Standings table */}
              {standings && standings.standings.length > 0 ? (
                <Reveal delay={0.25}>
                  <div className="mt-10 border border-white/10 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-bg-elev">
                        <tr className="font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                          <th className="px-3 py-3 text-left w-12">#</th>
                          <th className="px-3 py-3 text-left">Pilota</th>
                          <th className="px-3 py-3 text-right w-20">Pti</th>
                          <th className="px-3 py-3 text-right w-20">Scarto</th>
                          <th className="px-3 py-3 text-right w-20">Eventi</th>
                          {standings.rounds.map((r) => (
                            <th
                              key={r.roundNumber}
                              className="px-3 py-3 text-right w-20"
                            >
                              R{r.roundNumber}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {standings.standings.map((s) => (
                          <tr
                            key={s.position}
                            className={
                              s.position <= 3
                                ? "bg-yellow/5"
                                : "hover:bg-white/[0.02] transition-colors"
                            }
                          >
                            <td className="px-3 py-3 font-display text-lg text-yellow">
                              {s.position}
                            </td>
                            <td className="px-3 py-3 text-ink">
                              {s.pilotName}
                              {s.pilotNumber ? (
                                <span className="ml-2 font-mono text-[10px] text-ink-faint">
                                  #{s.pilotNumber}
                                </span>
                              ) : null}
                            </td>
                            <td className="px-3 py-3 text-right font-display text-lg">
                              {s.totalPoints}
                            </td>
                            <td className="px-3 py-3 text-right font-mono text-xs text-ink-dim">
                              {s.dropPoints || "—"}
                            </td>
                            <td className="px-3 py-3 text-right font-mono text-xs text-ink-dim">
                              {s.roundsCounted}/{s.roundsPlayed}
                            </td>
                            {standings.rounds.map((r) => {
                              const cell = lookup.get(
                                `${r.roundNumber}:${s.position}`,
                              );
                              return (
                                <td
                                  key={r.roundNumber}
                                  className="px-3 py-3 text-right font-mono text-xs"
                                >
                                  {cell ? (
                                    <>
                                      <span className="text-ink">
                                        {cell.points}
                                      </span>
                                      {cell.tqFlag ? (
                                        <span className="ml-1 text-yellow">
                                          TQ
                                        </span>
                                      ) : null}
                                    </>
                                  ) : (
                                    <span className="text-ink-faint">—</span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 font-mono text-[10px] uppercase tracking-widest text-ink-faint">
                    TQ = top qualifier · Pti = totale punti dopo scarti · Eventi
                    = contati / disputati · Fonte: myrcm.ch
                  </p>
                </Reveal>
              ) : (
                <Reveal delay={0.25}>
                  <p className="mt-10 text-ink-dim font-mono text-sm uppercase tracking-widest">
                    Classifica non ancora disponibile per questa categoria.
                  </p>
                </Reveal>
              )}
            </>
          )}
        </div>
      </section>

    </>
  );
}
