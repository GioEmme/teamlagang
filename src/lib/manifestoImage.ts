import fs from "node:fs";
import path from "node:path";

export function getManifestoImage(): string | null {
  const dir = path.join(process.cwd(), "public", "manifesto");
  try {
    if (!fs.existsSync(dir)) return null;
    const match = fs
      .readdirSync(dir)
      .filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f))
      .sort((a, b) => a.localeCompare(b, "it", { numeric: true }))[0];
    return match ? `/manifesto/${match}` : null;
  } catch {
    return null;
  }
}
