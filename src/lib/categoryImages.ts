import fs from "node:fs";
import path from "node:path";

export function getCategoryImages(): Record<string, string> {
  const dir = path.join(process.cwd(), "public", "categorie");
  const map: Record<string, string> = {};
  try {
    if (!fs.existsSync(dir)) return map;
    for (const f of fs.readdirSync(dir)) {
      const m = f.match(/^(.+?)\.(jpe?g|png|webp|avif)$/i);
      if (!m) continue;
      const slug = m[1].toLowerCase();
      map[slug] = `/categorie/${f}`;
    }
    return map;
  } catch {
    return map;
  }
}
