#!/usr/bin/env node
/**
 * Regenerates the hero plate derivatives from the canonical master.
 * The master is locked. This script cuts frames; it never recomposes.
 *
 *   npm run plate -- ./assets/atelier-master.png
 *
 * The master is the approved photographic environment. This script never
 * recomposes it — it only cuts the three art-directed frames, encodes AVIF +
 * WebP, and prints the LQIP to paste into lib/hero-plate.ts.
 *
 * The crops are chosen so that, at every breakpoint:
 *   • the lamp and its bloom stay in the right third (the lockup sits in it)
 *   • the marble desk stays in the lower frame (the sector cards sit above it)
 *   • the copy column never lands on a bright surface
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const master = process.argv[2] ?? "assets/atelier-master.png";
const outDir = path.join(process.cwd(), "public", "hero");

/**
 * aspect = crop ratio taken from the master; anchor = horizontal centre, 0–1.
 * Every frame preserves: left negative space for the copy, the skyline, the
 * lit joinery on the right, and the desk in the foreground.
 */
const FRAMES = [
  { name: "atelier-desktop", aspect: 3 / 2, anchor: 0.5, width: 1896, height: 1264 },
  { name: "atelier-tablet", aspect: 4 / 3, anchor: 0.55, width: 1400, height: 1050 },
  { name: "atelier-mobile", aspect: 3 / 4, anchor: 0.5, width: 1080, height: 1440 },
];

async function main() {
  await mkdir(outDir, { recursive: true });

  const meta = await sharp(master).metadata();
  const W = meta.width ?? 0;
  const H = meta.height ?? 0;
  if (!W || !H) throw new Error(`Cannot read ${master}`);
  if (W < 1600) {
    console.warn(`! Master is only ${W}px wide — the desktop plate will be soft on 2× displays.`);
  }

  for (const frame of FRAMES) {
    let cw = Math.min(W, Math.round(H * frame.aspect));
    let ch = Math.min(H, Math.round(cw / frame.aspect));
    const cx = Math.round(frame.anchor * W);
    const left = Math.max(0, Math.min(W - cw, cx - Math.round(cw / 2)));
    const top = Math.max(0, Math.round((H - ch) / 2));

    const base = sharp(master)
      .extract({ left, top, width: cw, height: ch })
      .resize(frame.width, frame.height, { fit: "fill", kernel: "lanczos3" })
      .sharpen({ sigma: 0.9 });

    await base.clone().webp({ quality: 84, effort: 6 }).toFile(path.join(outDir, `${frame.name}.webp`));
    await base.clone().avif({ quality: 62, effort: 6 }).toFile(path.join(outDir, `${frame.name}.avif`));

    console.log(`✓ ${frame.name}  ${frame.width}×${frame.height}`);
  }

  const lqip = await sharp(master).resize({ width: 20 }).webp({ quality: 40 }).toBuffer();
  const dataUri = `data:image/webp;base64,${lqip.toString("base64")}`;
  await writeFile(path.join(outDir, "lqip.txt"), dataUri, "utf8");

  console.log("\nPaste into HERO_PLATE_LQIP in lib/hero-plate.ts:\n");
  console.log(dataUri);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
