#!/usr/bin/env node
// Reads src/assets/frog-hero-bg-original.png and writes optimized WebP, AVIF,
// and a compressed PNG fallback to public/assets/. Invoked by the `prebuild`
// npm script.
import sharp from "sharp";
import { statSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SRC = resolve(ROOT, "src/assets/frog-hero-bg-original.png");
const OUT_DIR = resolve(ROOT, "public/assets");

const WIDTHS = [640, 1024, 1600];

const FORMATS = [
  { ext: "webp", opts: { quality: 78 } },
  { ext: "avif", opts: { quality: 55, effort: 4 } },
];

mkdirSync(OUT_DIR, { recursive: true });

const tasks = [];

for (const width of WIDTHS) {
  for (const fmt of FORMATS) {
    const out = resolve(OUT_DIR, `frog-hero-bg-${width}.${fmt.ext}`);
    tasks.push(
      sharp(SRC)
        .resize({ width, withoutEnlargement: true })
        .toFormat(fmt.ext, fmt.opts)
        .toFile(out)
        .then(() => log(out)),
    );
  }
}

// Fallback PNG (preserves filename for og:image and old browsers).
const pngOut = resolve(OUT_DIR, "frog-hero-bg.png");
tasks.push(
  sharp(SRC)
    .resize({ width: 1600, withoutEnlargement: true })
    .png({ compressionLevel: 9, quality: 80 })
    .toFile(pngOut)
    .then(() => log(pngOut)),
);

function log(p) {
  const { size } = statSync(p);
  console.log(`wrote ${p} (${(size / 1024).toFixed(1)} KB)`);
}

await Promise.all(tasks);
console.log("done");