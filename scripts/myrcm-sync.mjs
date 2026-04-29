// myrcm.ch sync — fetches events + championship standings for a given org id
// and upserts them into Neon. Idempotent. Run via:
//   npm run sync:myrcm                  # full sync
//   npm run sync:myrcm:dry              # parse only, no DB writes
//
// Defaults to org 5244 (RcLandia). Override with --org-id=NNNN or env MYRCM_ORG_ID.

import { config as loadEnv } from "dotenv";
import * as cheerio from "cheerio";
import { neon } from "@neondatabase/serverless";

loadEnv({ path: ".env.local" });

// --------------- args + config ---------------

const args = new Map();
for (const a of process.argv.slice(2)) {
  if (a.startsWith("--")) {
    const eq = a.indexOf("=");
    if (eq === -1) args.set(a.slice(2), true);
    else args.set(a.slice(2, eq), a.slice(eq + 1));
  }
}
const DRY_RUN = !!args.get("dry-run");
const SKIP_EVENTS = !!args.get("no-events");
const SKIP_CHAMPS = !!args.get("no-championships");
const RESET = !!args.get("reset");
const ORG_ID = args.get("org-id") || process.env.MYRCM_ORG_ID || "5244";
const REQUEST_DELAY_MS = 600;
const USER_AGENT =
  "Mozilla/5.0 (compatible; teamlagang-bot/1.0; +https://teamlagang.it)";

// --------------- helpers ---------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function log(label, msg) {
  const t = new Date().toISOString().split("T")[1].replace("Z", "");
  console.log(`[${t}] ${label.padEnd(8)} ${msg}`);
}

function parseDateIt(s) {
  // "DD.MM.YYYY" -> "YYYY-MM-DD"
  const m = s?.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})$/);
  if (!m) return null;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

function parseDeadlineIt(s) {
  // "DD.MM.YYYY HH:mm" -> ISO timestamp
  const m = s?.trim().match(/^(\d{2})\.(\d{2})\.(\d{4})\s+(\d{2}):(\d{2})$/);
  if (!m) return null;
  return `${m[3]}-${m[2]}-${m[1]}T${m[4]}:${m[5]}:00Z`;
}

function cleanText(s) {
  return s?.replace(/ /g, " ").replace(/\s+/g, " ").trim() ?? "";
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { "User-Agent": USER_AGENT } });
  if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
  return res.text();
}

// --------------- parsers ---------------

function parseEvents(html) {
  const $ = cheerio.load(html);
  const rows = $("#data-table tr").toArray();
  const events = [];
  for (const tr of rows) {
    const tds = $(tr).find("td").toArray();
    if (tds.length < 6) continue; // header or empty
    const linkA = $(tds[1]).find("a").first();
    const href = linkA.attr("href") || "";
    const idMatch = href.match(/dId\[E\]=(\d+)/);
    if (!idMatch) continue;
    const myrcmId = parseInt(idMatch[1], 10);

    const countCell = $(tds[4]);
    const countAnchors = countCell.find("a").toArray();
    const registered = countAnchors[0]
      ? parseInt(cleanText($(countAnchors[0]).text()), 10) || 0
      : 0;
    const waiting = countAnchors[1]
      ? parseInt(cleanText($(countAnchors[1]).text()), 10) || 0
      : 0;

    // Registration cell — distinguish open / closed / scheduled / unknown.
    const regCell = $(tds[5]);
    const regHtml = regCell.html() || "";
    const regText = cleanText(regCell.text());
    let registrationStatus = null;
    if (regHtml.includes("Sign up to this event")) {
      registrationStatus = "open";
    } else if (
      /color:\s*red/i.test(regHtml) ||
      /Nomina chiusa/i.test(regHtml)
    ) {
      registrationStatus = "closed";
    } else if (regText) {
      registrationStatus = "scheduled";
    }

    events.push({
      myrcmId,
      name: cleanText(linkA.text()),
      startDate: parseDateIt(cleanText($(tds[2]).text())),
      endDate: parseDateIt(cleanText($(tds[3]).text())),
      registeredCount: registered,
      waitingCount: waiting,
      registrationDeadline: parseDeadlineIt(regText),
      registrationStatus,
    });
  }
  return events;
}

function parseChampionshipsIndex(html) {
  const $ = cheerio.load(html);
  const rows = $("#table-data-championship tr").toArray();
  const champs = [];
  for (const tr of rows) {
    const tds = $(tr).find("td").toArray();
    if (tds.length < 7) continue;
    const reportLink = $(tds[6]).find("a[onclick]").first();
    const onclick = reportLink.attr("onclick") || "";
    const idMatch = onclick.match(/openNewWindows\((\d+)\)/);
    if (!idMatch) continue;

    const rawCategory = cleanText($(tds[2]).text());
    const category = rawCategory.replace(/\s*\[.*\]\s*$/, "").trim();

    const countedRaw = cleanText($(tds[4]).text());
    const notCountedRaw = cleanText($(tds[5]).text());

    champs.push({
      myrcmId: parseInt(idMatch[1], 10),
      name: cleanText($(tds[1]).text()),
      category,
      year: parseInt(cleanText($(tds[3]).text()), 10),
      roundsCounted: countedRaw ? parseInt(countedRaw, 10) : null,
      roundsNotCounted: notCountedRaw ? parseInt(notCountedRaw, 10) : null,
    });
  }
  return champs;
}

function parseChampionshipDetail(html) {
  const $ = cheerio.load(html);
  // Two tables on the page: first is the rounds index (#data-table),
  // second is the standings (no id/class). Select all and take by position.
  const tables = $("table").toArray();
  const result = { rounds: [], standings: [], roundResults: [] };

  // -------- rounds (first table) --------
  const roundsTable = tables[0];
  if (roundsTable) {
    for (const tr of $(roundsTable).find("tr").toArray()) {
      const tds = $(tr).find("td").toArray();
      if (tds.length < 5) continue;
      const roundNumber = parseInt(cleanText($(tds[0]).text()), 10);
      if (!Number.isFinite(roundNumber)) continue;
      const dateCell = cleanText($(tds[2]).text());
      const [start, end] = dateCell.split("-").map((p) => parseDateIt(p.trim()));
      result.rounds.push({
        roundNumber,
        eventName: cleanText($(tds[1]).text()),
        startDate: start,
        endDate: end || start,
        processed: /si/i.test(cleanText($(tds[3]).text())),
        counted: /si/i.test(cleanText($(tds[4]).text())),
      });
    }
  }

  // -------- standings (second table) --------
  const standingsTable = tables[1];
  if (!standingsTable) return result;

  const trs = $(standingsTable).find("tr").toArray();
  const headerCells = $(trs[0]).find("th").toArray();
  // Header: Classifica, Nr., Pilota, Punti, Scarto, Eventi, Nr. 1, Nr. 2, ...
  const FIXED_HEADER_COLS = 6;
  const roundCols = headerCells.length - FIXED_HEADER_COLS;

  for (const tr of trs.slice(1)) {
    const tds = $(tr).find("td").toArray();
    if (tds.length < FIXED_HEADER_COLS) continue;
    const position = parseInt(cleanText($(tds[0]).text()), 10);
    if (!Number.isFinite(position)) continue;

    const pilotNumberRaw = cleanText($(tds[1]).text());
    const pilotName = cleanText($(tds[2]).text());
    const totalPoints = parseInt(cleanText($(tds[3]).text()), 10) || 0;
    const dropPoints = parseInt(cleanText($(tds[4]).text()), 10) || 0;
    const eventiCell = cleanText($(tds[5]).text());
    // "4 [1]" -> counted=4, drops=1
    const eventiMatch = eventiCell.match(/^(\d+)\s*\[(\d+)\]/);
    const roundsCounted = eventiMatch ? parseInt(eventiMatch[1], 10) : 0;
    const dropsUsed = eventiMatch ? parseInt(eventiMatch[2], 10) : 0;

    let roundsPlayed = 0;
    for (let i = 0; i < roundCols; i++) {
      const td = tds[FIXED_HEADER_COLS + i];
      if (!td) continue;
      const text = cleanText($(td).text());
      if (!text || text === "- / -") continue;
      const m = text.match(/^(\d+)\s*\/\s*(\d+)(\s*TQ)?$/);
      if (!m) continue;
      const points = parseInt(m[1], 10);
      const penalty = parseInt(m[2], 10);
      const tqFlag = !!m[3];
      roundsPlayed++;
      result.roundResults.push({
        roundNumber: i + 1,
        pilotPosition: position,
        pilotName,
        points,
        penalty,
        tqFlag,
      });
    }

    result.standings.push({
      position,
      pilotName,
      pilotNumber: pilotNumberRaw || null,
      totalPoints,
      dropPoints,
      roundsPlayed: Math.max(roundsPlayed, roundsCounted + dropsUsed),
      roundsCounted,
    });
  }

  return result;
}

// --------------- DB operations (raw SQL via neon) ---------------

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not defined");
  return neon(url);
}

async function upsertEvents(sql, events) {
  let processed = 0;
  for (const e of events) {
    await sql`
      INSERT INTO mr_events (
        myrcm_id, name, start_date, end_date,
        registered_count, waiting_count, registration_deadline,
        registration_status, fetched_at
      ) VALUES (
        ${e.myrcmId}, ${e.name}, ${e.startDate}, ${e.endDate},
        ${e.registeredCount}, ${e.waitingCount}, ${e.registrationDeadline},
        ${e.registrationStatus}, NOW()
      )
      ON CONFLICT (myrcm_id) DO UPDATE SET
        name = EXCLUDED.name,
        start_date = EXCLUDED.start_date,
        end_date = EXCLUDED.end_date,
        registered_count = EXCLUDED.registered_count,
        waiting_count = EXCLUDED.waiting_count,
        registration_deadline = EXCLUDED.registration_deadline,
        registration_status = EXCLUDED.registration_status,
        fetched_at = NOW()
    `;
    processed++;
  }
  return processed;
}

async function upsertChampionship(sql, champ, detail) {
  await sql`
    INSERT INTO mr_championships (
      myrcm_id, name, category, year, rounds_counted, rounds_not_counted, fetched_at
    ) VALUES (
      ${champ.myrcmId}, ${champ.name}, ${champ.category}, ${champ.year},
      ${champ.roundsCounted}, ${champ.roundsNotCounted}, NOW()
    )
    ON CONFLICT (myrcm_id) DO UPDATE SET
      name = EXCLUDED.name,
      category = EXCLUDED.category,
      year = EXCLUDED.year,
      rounds_counted = EXCLUDED.rounds_counted,
      rounds_not_counted = EXCLUDED.rounds_not_counted,
      fetched_at = NOW()
  `;
  const [row] = await sql`
    SELECT id FROM mr_championships WHERE myrcm_id = ${champ.myrcmId} LIMIT 1
  `;
  const championshipId = row.id;

  // wipe child tables and rewrite — simpler than diffing
  await sql`DELETE FROM mr_championship_rounds WHERE championship_id = ${championshipId}`;
  await sql`DELETE FROM mr_standings WHERE championship_id = ${championshipId}`;
  await sql`DELETE FROM mr_round_results WHERE championship_id = ${championshipId}`;

  for (const r of detail.rounds) {
    await sql`
      INSERT INTO mr_championship_rounds (
        championship_id, round_number, event_name, start_date, end_date, processed, counted
      ) VALUES (
        ${championshipId}, ${r.roundNumber}, ${r.eventName}, ${r.startDate}, ${r.endDate}, ${r.processed}, ${r.counted}
      )
    `;
  }
  for (const s of detail.standings) {
    await sql`
      INSERT INTO mr_standings (
        championship_id, position, pilot_name, pilot_number,
        total_points, drop_points, rounds_played, rounds_counted
      ) VALUES (
        ${championshipId}, ${s.position}, ${s.pilotName}, ${s.pilotNumber},
        ${s.totalPoints}, ${s.dropPoints}, ${s.roundsPlayed}, ${s.roundsCounted}
      )
    `;
  }
  for (const r of detail.roundResults) {
    await sql`
      INSERT INTO mr_round_results (
        championship_id, round_number, pilot_position, pilot_name, points, penalty, tq_flag
      ) VALUES (
        ${championshipId}, ${r.roundNumber}, ${r.pilotPosition}, ${r.pilotName}, ${r.points}, ${r.penalty}, ${r.tqFlag}
      )
    `;
  }

  return championshipId;
}

async function recordSyncRun(sql, started, ok, eventsCount, champsCount, err) {
  await sql`
    INSERT INTO mr_sync_runs (
      started_at, finished_at, ok, events_processed, championships_processed, error_message
    ) VALUES (
      ${started.toISOString()}, NOW(), ${ok}, ${eventsCount}, ${champsCount},
      ${err ? String(err.message ?? err).slice(0, 2000) : null}
    )
  `;
}

// --------------- main ---------------

async function main() {
  const started = new Date();
  const sql = DRY_RUN ? null : getSql();

  log("INFO", `Starting sync (org=${ORG_ID}, dryRun=${DRY_RUN}, reset=${RESET})`);
  let eventsProcessed = 0;
  let champsProcessed = 0;

  try {
    if (RESET && sql) {
      log("RESET", "Truncating mr_* tables (preserving sync_runs)");
      await sql`TRUNCATE TABLE mr_round_results, mr_standings, mr_championship_rounds, mr_championships, mr_events RESTART IDENTITY CASCADE`;
    }

    const mainUrl = `https://www.myrcm.ch/myrcm/main?hId%5B1%5D=org&dId%5BO%5D=${ORG_ID}&pLa=it`;
    log("FETCH", mainUrl);
    const html = await fetchHtml(mainUrl);

    if (!SKIP_EVENTS) {
      const events = parseEvents(html);
      log("PARSE", `events: ${events.length}`);
      if (sql) eventsProcessed = await upsertEvents(sql, events);
      else eventsProcessed = events.length;
      log("DB", `events upserted: ${eventsProcessed}`);
    }

    if (!SKIP_CHAMPS) {
      const champs = parseChampionshipsIndex(html);
      log("PARSE", `championships: ${champs.length}`);
      for (const c of champs) {
        await sleep(REQUEST_DELAY_MS);
        const url = `https://www.myrcm.ch/myrcm/championship/it/${c.myrcmId}`;
        log("FETCH", `${url} (${c.name} · ${c.category})`);
        const detailHtml = await fetchHtml(url);
        const detail = parseChampionshipDetail(detailHtml);
        log(
          "PARSE",
          `  rounds=${detail.rounds.length} standings=${detail.standings.length} round_results=${detail.roundResults.length}`,
        );
        if (sql) await upsertChampionship(sql, c, detail);
        champsProcessed++;
      }
      log("DB", `championships upserted: ${champsProcessed}`);
    }

    if (sql)
      await recordSyncRun(
        sql,
        started,
        true,
        eventsProcessed,
        champsProcessed,
        null,
      );
    log("DONE", `events=${eventsProcessed} championships=${champsProcessed}`);
  } catch (err) {
    if (sql)
      await recordSyncRun(
        sql,
        started,
        false,
        eventsProcessed,
        champsProcessed,
        err,
      );
    log("ERROR", err.stack || err.message || String(err));
    process.exitCode = 1;
  }
}

main();
