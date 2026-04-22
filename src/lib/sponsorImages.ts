import fs from "node:fs";
import path from "node:path";

export function getSponsorImages(): string[] {
  const dir = path.join(process.cwd(), "public", "sponsors");
  try {
    if (!fs.existsSync(dir)) return [];
    return fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif|svg)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, "it", { numeric: true }))
      .map((f) => `/sponsors/${f}`);
  } catch {
    return [];
  }
}
