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

const FETCH_TIMEOUT_MS = 30000;
const FETCH_RETRIES = 3;

function describeCause(err) {
  const c = err?.cause;
  if (!c) return "";
  return ` (cause: ${c.code ?? c.message ?? String(c)})`;
}

async function fetchOnce(url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function fetchHtml(url) {
  let lastErr;
  for (let attempt = 1; attempt <= FETCH_RETRIES + 1; attempt++) {
    try {
      return await fetchOnce(url);
    } catch (err) {
      lastErr = err;
      if (attempt <= FETCH_RETRIES) {
        const backoff = 1500 * attempt * attempt; // 1.5s, 6s, 13.5s
        log(
          "RETRY",
          `attempt ${attempt}/${FETCH_RETRIES} failed: ${err.message}${describeCause(err)} — retry in ${backoff}ms`,
        );
        await sleep(backoff);
      }
    }
  }
  // Enrich the final message with the underlying cause for the DB record.
  if (lastErr && !String(lastErr.message).includes("cause")) {
    lastErr.message = `${lastErr.message}${describeCause(lastErr)}`;
  }
  throw lastErr;
}

// --------------- parsers ---------------

// myrcm.ch redesigned its site in 2026: the org page moved to
// /it/organizers/<org> and lists event ids only (upcoming cards + past table);
// dates, status and entry counts live on each event's detail page.

const MONTHS = {
  gen: 1, jan: 1, feb: 2, mar: 3, "mär": 3, apr: 4, mag: 5, mai: 5, may: 5,
  giu: 6, jun: 6, lug: 7, jul: 7, ago: 8, aug: 8, set: 9, sep: 9,
  ott: 10, okt: 10, oct: 10, nov: 11, dic: 12, dez: 12, dec: 12,
};

function isoFromParts(day, month, year) {
  const mm = MONTHS[cleanText(month).toLowerCase().slice(0, 3)];
  const dd = parseInt(cleanText(day), 10);
  const yy = parseInt(cleanText(year), 10);
  if (!mm || !dd || !yy) return null;
  return `${yy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
}

function parseOrgPage(html) {
  const $ = cheerio.load(html);
  const eventIds = [];
  const seen = new Set();
  const addId = (href) => {
    const m = (href || "").match(/\/organizers\/\d+\/(\d+)/);
    if (!m) return;
    const id = parseInt(m[1], 10);
    if (!seen.has(id)) {
      seen.add(id);
      eventIds.push(id);
    }
  };
  // upcoming events: cards without the championship-row class
  $("article.host-event-row:not(.championship-row) h3 a").each((_, a) =>
    addId($(a).attr("href")),
  );
  // past events: history table
  $("table.host-history-table tbody tr").each((_, tr) =>
    addId($(tr).find("td").eq(1).find("a").attr("href")),
  );

  const champs = [];
  $("article.championship-row").each((_, art) => {
    const url = $(art).find("[data-report-url]").attr("data-report-url") || "";
    const idMatch = url.match(/championship\/(\d+)/);
    if (!idMatch) return;
    const header = cleanText(
      $(art).closest("section").find(".section-header h2").first().text(),
    );
    const year = parseInt((header.match(/(\d{4})/) || [])[1], 10) || null;
    const rawCategory = cleanText($(art).find("p").first().text());
    const events = parseInt(cleanText($(art).find(".badge").first().text()), 10);
    champs.push({
      myrcmId: parseInt(idMatch[1], 10),
      name: cleanText($(art).find("h3").first().text()),
      category: rawCategory.replace(/\s*\[.*\]\s*$/, "").trim(),
      year,
      roundsCounted: Number.isFinite(events) ? events : null,
      roundsNotCounted: null,
    });
  });
  return { eventIds, champs };
}

function parseEventDetail(html, myrcmId) {
  const $ = cheerio.load(html);
  const header = $("section.detail-header").first();
  const dateOf = (sel) => {
    const box = header.find(sel).first();
    if (!box.length) return null;
    return isoFromParts(
      box.find(".date-day").text(),
      box.find(".date-month").text(),
      box.find(".date-year").text(),
    );
  };
  const startDate = dateOf(".date-box.from") ?? dateOf(".date-box");
  const endDate = dateOf(".date-box.to") ?? startDate;

  // status badge next to the title: open / notopen ("aperta dal …") / closed
  let registrationStatus = null;
  header.find(".badges .badge").each((_, b) => {
    const cls = $(b).attr("class") || "";
    if (/\bnotopen\b/.test(cls)) registrationStatus = "scheduled";
    else if (/\bopen\b/.test(cls)) registrationStatus = "open";
    else if (/\bclosed\b/.test(cls)) registrationStatus = "closed";
  });

  // entries per class: confirmed (list type 1) and waiting list (type 0).
  // Only tbody rows: the tfoot "Totale" row repeats the sums.
  let registered = 0;
  let waiting = 0;
  $("table.event-class-table tbody [data-booking-list-type]").each((_, btn) => {
    const n = parseInt(cleanText($(btn).text()), 10) || 0;
    if ($(btn).attr("data-booking-list-type") === "1") registered += n;
    else if ($(btn).attr("data-booking-list-type") === "0") waiting += n;
  });

  // the deadline is still in the markup, but inside an HTML comment
  const dl = html.match(
    /Anmeldeschluss<\/span>\s*<span class="info-value">(\d{1,2}) (\S+) (\d{4}) (\d{2}):(\d{2})/,
  );
  const dlDate = dl ? isoFromParts(dl[1], dl[2], dl[3]) : null;

  return {
    myrcmId,
    name: cleanText(header.find("h1.event-title").first().text()),
    startDate,
    endDate,
    registeredCount: registered,
    waitingCount: waiting,
    registrationDeadline: dlDate ? `${dlDate}T${dl[4]}:${dl[5]}:00Z` : null,
    registrationStatus,
  };
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

    const mainUrl = `https://www.myrcm.ch/it/organizers/${ORG_ID}`;
    log("FETCH", mainUrl);
    const html = await fetchHtml(mainUrl);
    const org = parseOrgPage(html);
    log("PARSE", `event ids: ${org.eventIds.length}, championships: ${org.champs.length}`);
    // An empty page means the layout changed again: fail loudly instead of
    // reporting a "successful" sync that writes nothing.
    if (org.eventIds.length === 0 || org.champs.length === 0) {
      throw new Error(
        `myrcm org page parsed empty (events=${org.eventIds.length}, championships=${org.champs.length}) — layout changed?`,
      );
    }

    if (!SKIP_EVENTS) {
      const events = [];
      for (const id of org.eventIds) {
        await sleep(REQUEST_DELAY_MS);
        const url = `https://www.myrcm.ch/it/organizers/${ORG_ID}/${id}`;
        const ev = parseEventDetail(await fetchHtml(url), id);
        if (!ev.name || !ev.startDate) {
          log("WARN", `skip ${url}: name or date not found`);
          continue;
        }
        log(
          "PARSE",
          `  ${ev.startDate} ${ev.name} · ${ev.registrationStatus ?? "-"} · ${ev.registeredCount} iscritti, ${ev.waitingCount} in attesa`,
        );
        events.push(ev);
      }
      log("PARSE", `events: ${events.length}`);
      if (sql) eventsProcessed = await upsertEvents(sql, events);
      else eventsProcessed = events.length;
      log("DB", `events upserted: ${eventsProcessed}`);
    }

    if (!SKIP_CHAMPS) {
      for (const c of org.champs) {
        await sleep(REQUEST_DELAY_MS);
        const url = `https://www.myrcm.ch/rest/v1/championship/${c.myrcmId}?pLa=it`;
        log("FETCH", `${url} (${c.name} · ${c.category} · ${c.year})`);
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
    log("ERROR", `${err.stack || err.message || String(err)}${describeCause(err)}`);
    process.exitCode = 1;
  }
}

main();
