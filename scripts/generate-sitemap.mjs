#!/usr/bin/env node
// Regenerates public/sitemap.xml with today's date and hreflang alternates
// for every supported locale. Run automatically as a `prebuild` step.
import { writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");

const SITE = "https://compresspic.top";
const LOCALES = [
  "zh-CN",
  "en-US",
  "zh-TW",
  "ja-JP",
  "ko-KR",
  "fr-FR",
  "es-ES",
  "tr-TR",
  "fa-IR",
];
const DEFAULT_LANG = "en-US";

const lastmod = new Date().toISOString().slice(0, 10);

const urlFor = (lang) =>
  lang === DEFAULT_LANG ? `${SITE}/` : `${SITE}/${lang}/`;

const urls = LOCALES.map((lang) => {
  const alternates = LOCALES.map(
    (l) =>
      `    <xhtml:link rel="alternate" hreflang="${l}" href="${urlFor(l)}"/>`,
  ).join("\n");
  const xdefault = `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}/"/>`;
  const priority = lang === DEFAULT_LANG ? "1.0" : "0.8";
  return `  <url>
    <loc>${urlFor(lang)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${priority}</priority>
${alternates}
${xdefault}
  </url>`;
}).join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;

const target = resolve(ROOT, "public", "sitemap.xml");
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, xml, "utf8");
console.log(`wrote ${target}`);