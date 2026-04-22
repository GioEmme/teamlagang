import fs from "node:fs";
import path from "node:path";

export function getTeamImages(): Record<string, string> {
  const dir = path.join(process.cwd(), "public", "team");
  const map: Record<string, string> = {};
  try {
    if (!fs.existsSync(dir)) return map;
    for (const f of fs.readdirSync(dir)) {
      const m = f.match(/^(.+?)\.(jpe?g|png|webp|avif)$/i);
      if (!m) continue;
      map[m[1]] = `/team/${f}`;
    }
    return map;
  } catch {
    return map;
  }
}
