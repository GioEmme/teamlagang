import { and, asc, desc, eq, gte, inArray, lt, lte, sql } from "drizzle-orm";
import { db } from "@/lib/db/client";
import {
  mrChampionshipRounds,
  mrChampionships,
  mrEvents,
  mrRoundResults,
  mrStandings,
} from "@/lib/db/schema";

// ----------------- urls -----------------

export const MYRCM_ORG_ID = 5244; // RcLandia

// Registration ("booking") URL — lands on the event sign-up flow on myrcm.
export function buildMyrcmEventUrl(eventId: number) {
  const sp = new URLSearchParams();
  sp.set("hId[1]", "bkg");
  sp.set("dId[E]", String(eventId));
  sp.set("pLa", "it");
  return `https://www.myrcm.ch/myrcm/main?${sp.toString()}`;
}

// ----------------- events (full calendar, all races) -----------------

export async function getUpcomingEvents(limit = 12) {
  return db
    .select()
    .from(mrEvents)
    .where(gte(mrEvents.startDate, sql`CURRENT_DATE`))
    .orderBy(asc(mrEvents.startDate))
    .limit(limit);
}

export async function getRecentEvents(limit = 6) {
  return db
    .select()
    .from(mrEvents)
    .where(lt(mrEvents.startDate, sql`CURRENT_DATE`))
    .orderBy(desc(mrEvents.startDate))
    .limit(limit);
}

// Latest scheduled events regardless of past/future, ordered most recent first.
export async function getLatestEvents(limit = 10) {
  return db
    .select()
    .from(mrEvents)
    .orderBy(desc(mrEvents.startDate))
    .limit(limit);
}

// Closest upcoming event whose start_date falls inside [today+minDays, today+maxDays].
// Used by the rail/FAB to show a pulsing CTA that pings users when an event is near.
export type NextEventTeaser = {
  myrcmId: number;
  name: string;
  daysUntil: number;
};

export async function getNextEventInWindow(
  minDays: number,
  maxDays: number,
): Promise<NextEventTeaser | null> {
  const today = new Date();
  const todayMidnight = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate(),
  );
  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

  const startBound = new Date(todayMidnight);
  startBound.setDate(startBound.getDate() + minDays);
  const endBound = new Date(todayMidnight);
  endBound.setDate(endBound.getDate() + maxDays);

  const [row] = await db
    .select({
      myrcmId: mrEvents.myrcmId,
      name: mrEvents.name,
      startDate: mrEvents.startDate,
    })
    .from(mrEvents)
    .where(
      and(
        gte(mrEvents.startDate, fmt(startBound)),
        lte(mrEvents.startDate, fmt(endBound)),
      ),
    )
    .orderBy(asc(mrEvents.startDate))
    .limit(1);

  if (!row) return null;

  // Compute days until — drizzle returns YYYY-MM-DD string for date columns
  const sd = row.startDate as unknown as string | Date;
  const iso =
    typeof sd === "string"
      ? sd.slice(0, 10)
      : `${sd.getFullYear()}-${String(sd.getMonth() + 1).padStart(2, "0")}-${String(sd.getDate()).padStart(2, "0")}`;
  const eventDate = new Date(`${iso}T00:00:00`);
  const daysUntil = Math.round(
    (eventDate.getTime() - todayMidnight.getTime()) / 86400000,
  );

  return { myrcmId: row.myrcmId, name: row.name, daysUntil };
}

// ----------------- Italian Indoor Series only (results) -----------------

// IIS championships have "Indoor Series" in the name (covers both
// "Italian Indoor Series 2025/26" and "Campionato Italian Indoor Series 2024/25")
const IIS_NAME_FILTER = sql`${mrChampionships.name} ILIKE '%Indoor Series%'`;

export type IisSeason = {
  key: string; // grouping key + display label, e.g. "ITALIAN INDOOR SERIES 2025/26 (2025)"
  year: number;
  // Source DB names that fold into this group (different capitalizations on myrcm)
  names: string[];
};

// Group raw championship names by UPPER(name) + year so that capitalization
// variants on myrcm (e.g. "Italian Indoor Series" / "Italian indoor series")
// collapse into a single season. Sorted by year DESC.
export async function getIisSeasons(): Promise<IisSeason[]> {
  const rows = await db
    .select({
      name: mrChampionships.name,
      year: mrChampionships.year,
    })
    .from(mrChampionships)
    .where(IIS_NAME_FILTER);

  const byKey = new Map<string, IisSeason>();
  for (const r of rows) {
    const key = `${r.name.toUpperCase()} (${r.year})`;
    let g = byKey.get(key);
    if (!g) {
      g = { key, year: r.year, names: [] };
      byKey.set(key, g);
    }
    if (!g.names.includes(r.name)) g.names.push(r.name);
  }
  return Array.from(byKey.values()).sort((a, b) => {
    if (b.year !== a.year) return b.year - a.year;
    return a.key.localeCompare(b.key);
  });
}

async function findSeason(seasonKey: string): Promise<IisSeason | null> {
  const seasons = await getIisSeasons();
  return seasons.find((s) => s.key === seasonKey) ?? null;
}

export async function getIisCategories(seasonKey: string): Promise<string[]> {
  const season = await findSeason(seasonKey);
  if (!season) return [];
  const rows = await db
    .selectDistinct({ category: mrChampionships.category })
    .from(mrChampionships)
    .where(inArray(mrChampionships.name, season.names))
    .orderBy(asc(mrChampionships.category));
  return rows.map((r) => r.category);
}

export type IisStandings = {
  championship: typeof mrChampionships.$inferSelect;
  rounds: (typeof mrChampionshipRounds.$inferSelect)[];
  standings: (typeof mrStandings.$inferSelect)[];
  results: (typeof mrRoundResults.$inferSelect)[];
};

export async function getIisStandings(
  seasonKey: string,
  category: string,
): Promise<IisStandings | null> {
  const season = await findSeason(seasonKey);
  if (!season) return null;
  const [champ] = await db
    .select()
    .from(mrChampionships)
    .where(
      and(
        inArray(mrChampionships.name, season.names),
        eq(mrChampionships.category, category),
      ),
    )
    .limit(1);
  if (!champ) return null;

  const [standings, rounds, results] = await Promise.all([
    db
      .select()
      .from(mrStandings)
      .where(eq(mrStandings.championshipId, champ.id))
      .orderBy(asc(mrStandings.position)),
    db
      .select()
      .from(mrChampionshipRounds)
      .where(eq(mrChampionshipRounds.championshipId, champ.id))
      .orderBy(asc(mrChampionshipRounds.roundNumber)),
    db
      .select()
      .from(mrRoundResults)
      .where(eq(mrRoundResults.championshipId, champ.id))
      .orderBy(asc(mrRoundResults.roundNumber), desc(mrRoundResults.points)),
  ]);

  return { championship: champ, rounds, standings, results };
}

// Winner per round = pilot with the highest points (in IIS scoring,
// the 1st classified gets 83 pts; ties broken by TQ flag).
export function pickRoundWinners(data: IisStandings) {
  const byRound = new Map<
    number,
    {
      roundNumber: number;
      pilotName: string;
      points: number;
      tqFlag: boolean;
    } | null
  >();
  for (const round of data.rounds) byRound.set(round.roundNumber, null);
  for (const r of data.results) {
    const cur = byRound.get(r.roundNumber);
    if (
      !cur ||
      r.points > cur.points ||
      (r.points === cur.points && r.tqFlag && !cur.tqFlag)
    ) {
      byRound.set(r.roundNumber, {
        roundNumber: r.roundNumber,
        pilotName: r.pilotName,
        points: r.points,
        tqFlag: r.tqFlag,
      });
    }
  }
  return Array.from(byRound.values());
}

// Index round_results by [roundNumber][pilotPosition] for fast cell lookup
// when rendering the standings table with one column per round.
export function buildResultsLookup(data: IisStandings) {
  const map = new Map<string, (typeof mrRoundResults.$inferSelect)>();
  for (const r of data.results) {
    map.set(`${r.roundNumber}:${r.pilotPosition}`, r);
  }
  return map;
}
