import fs from "node:fs";
import path from "node:path";

export function getHeroImages(): string[] {
  const dir = path.join(process.cwd(), "public", "hero");
  try {
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, "it", { numeric: true }))
      .map((f) => `/hero/${f}`);
  } catch {
    return [];
  }
}
