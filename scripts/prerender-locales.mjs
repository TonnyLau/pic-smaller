#!/usr/bin/env node
// Reads dist/index.html and src/locales/{lang}.ts and writes one static
// HTML shell per locale into dist/. Replaces the hardcoded <html lang>,
// <title>, <meta description>, <link rel="canonical">, hreflang alternates,
// OG / Twitter tags, and JSON-LD with the locale's strings. This lets every
// /{lang}/ URL return a fully localized <head> on first paint, before the
// React app hydrates. The body, JS, and CSS bundles stay shared.

import { readFile, writeFile } from "node:fs/promises";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const DIST = resolve(ROOT, "dist");
const LOCALES_DIR = resolve(ROOT, "src/locales");

const LOCALES = [
  "zh-CN",
  "zh-TW",
  "en-US",
  "ja-JP",
  "ko-KR",
  "fr-FR",
  "es-ES",
  "tr-TR",
  "fa-IR",
];
const DEFAULT_LOCALE = "en-US";
const SITE_URL = "https://compresspic.top";
const OG_IMAGE_WEBP = "/assets/frog-hero-bg-1600.webp";
const HERO_W = 1600;
const HERO_H = 686;

// Parse a TS locale file. Locale files have a stable shape:
//   logo: "...",
//   homeContent: { meta: { title: "...", description: "..." }, ..., faqs: [...] }
// so a focused regex set is enough — no TS transpiler needed.
// Locale files use CRLF line endings, so we normalize to LF up front.
function parseLocale(ts) {
  const src = ts.replace(/\r\n/g, "\n");
  const logo = (src.match(/^  logo:\s*"((?:[^"\\]|\\.)*)"/m) ?? [])[1] ?? "";

  // homeContent.meta block
  const title =
    (src.match(
      /homeContent:\s*\{[\s\S]*?meta:\s*\{[\s\S]*?title:\s*"((?:[^"\\]|\\.)*)"/,
    )?.[1]) ?? "";
  const descBlock =
    src.match(
      /homeContent:\s*\{[\s\S]*?meta:\s*\{[\s\S]*?description:\s*([\s\S]*?)\},\s*\n\s*intro:/,
    )?.[1] ?? "";
  const description = [...descBlock.matchAll(/"((?:[^"\\]|\\.)*)"/g)]
    .map((m) => m[1])
    .join("");

  // homeContent.faqs array. The structure is:
  //   homeContent: { ..., faqs: [ ... ], },
  //   uploadCard: { ... }
  // so the array close `],` is followed by the homeContent close `},` and
  // then `uploadCard:`. Anchor on the array-close line.
  const faqsBody =
    src.match(/faqs:\s*\[([\s\S]*?)\n\s*\],\s*\n\s*\},\s*\n\s*uploadCard:/)?.[1] ?? "";
  const qaRegex =
    /question:\s*"((?:[^"\\]|\\.)*)",\s*\n\s*answer:\s*"((?:[^"\\]|\\.)*)"/g;
  const faqs = [];
  for (const m of faqsBody.matchAll(qaRegex)) {
    faqs.push({ question: m[1], answer: m[2] });
  }

  return { logo, title, description, faqs };
}

const escapeAttr = (s) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

function buildJsonLd(lang, locale) {
  const url = lang === DEFAULT_LOCALE ? `${SITE_URL}/` : `${SITE_URL}/${lang}/`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url,
        name: locale.logo,
        inLanguage: lang,
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${SITE_URL}/#app`,
        name: locale.logo,
        applicationCategory: "MultimediaApplication",
        operatingSystem: "Web",
        url,
        description: locale.description,
        image: `${SITE_URL}${OG_IMAGE_WEBP}`,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE_URL}/#faq`,
        mainEntity: locale.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
    ],
  };
}

function buildHtml(template, lang, locale) {
  let html = template;
  const url = lang === DEFAULT_LOCALE ? `${SITE_URL}/` : `${SITE_URL}/${lang}/`;

  // <html lang>
  html = html.replace(/<html\s+lang="[^"]*"/, `<html lang="${lang}"`);

  // <title>
  html = html.replace(
    /<title>[^<]*<\/title>/,
    `<title>${escapeAttr(locale.title)}</title>`,
  );

  // <meta name="description">
  html = html.replace(
    /<meta\s+name="description"\s+content="[^"]*"\s*\/>/,
    `<meta name="description" content="${escapeAttr(locale.description)}" />`,
  );

  // <link rel="canonical"> — self-canonical per locale
  html = html.replace(
    /<link rel="canonical" href="[^"]*"\s*\/>/,
    `<link rel="canonical" href="${url}" />`,
  );

  // hreflang alternates
  for (const l of LOCALES) {
    const href = l === DEFAULT_LOCALE ? `${SITE_URL}/` : `${SITE_URL}/${l}/`;
    html = html.replace(
      new RegExp(
        `<link rel="alternate" hreflang="${l.replace("-", "\\-")}" href="[^"]*"\\s*\\/>`,
      ),
      `<link rel="alternate" hreflang="${l}" href="${href}" />`,
    );
  }
  html = html.replace(
    /<link rel="alternate" hreflang="x-default" href="[^"]*"\s*\/>/,
    `<link rel="alternate" hreflang="x-default" href="${SITE_URL}/" />`,
  );

  // OG / Twitter — allow multi-line meta tags (Vite emits them across lines).
  const setMeta = (re, value) => html.replace(re, value);
  html = setMeta(
    /<meta\s+property="og:site_name"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:site_name" content="${escapeAttr(locale.logo)}" />`,
  );
  html = setMeta(
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:url" content="${url}" />`,
  );
  html = setMeta(
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:title" content="${escapeAttr(locale.title)}" />`,
  );
  html = setMeta(
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:description" content="${escapeAttr(locale.description)}" />`,
  );
  html = setMeta(
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image" content="${SITE_URL}${OG_IMAGE_WEBP}" />`,
  );
  html = setMeta(
    /<meta\s+property="og:image:width"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image:width" content="${HERO_W}" />`,
  );
  html = setMeta(
    /<meta\s+property="og:image:height"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image:height" content="${HERO_H}" />`,
  );
  html = setMeta(
    /<meta\s+property="og:image:type"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image:type" content="image/webp" />`,
  );
  html = setMeta(
    /<meta\s+property="og:image:alt"\s+content="[^"]*"\s*\/>/,
    `<meta property="og:image:alt" content="${escapeAttr(locale.title)}" />`,
  );
  html = setMeta(
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:title" content="${escapeAttr(locale.title)}" />`,
  );
  html = setMeta(
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:description" content="${escapeAttr(locale.description)}" />`,
  );
  html = setMeta(
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:image" content="${SITE_URL}${OG_IMAGE_WEBP}" />`,
  );
  html = setMeta(
    /<meta\s+name="twitter:image:alt"\s+content="[^"]*"\s*\/>/,
    `<meta name="twitter:image:alt" content="${escapeAttr(locale.title)}" />`,
  );

  // JSON-LD
  const jsonLd = JSON.stringify(buildJsonLd(lang, locale), null, 2);
  html = html.replace(
    /<script type="application\/ld\+json">[\s\S]*?<\/script>/,
    `<script type="application/ld+json">\n${jsonLd}\n    </script>`,
  );

  // Inject preconnect, dns-prefetch, and meta robots right after viewport
  // — only if not already present (script is idempotent for re-runs).
  if (!html.includes('name="robots"')) {
    const inject = `    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
    <link rel="preconnect" href="https://www.googletagmanager.com" />
    <link rel="dns-prefetch" href="https://www.googletagmanager.com" />`;
    html = html.replace(/<meta name="viewport"[^>]*>/, (m) => `${m}\n${inject}`);
  }

  return html;
}

async function main() {
  const template = await readFile(join(DIST, "index.html"), "utf8");
  for (const lang of LOCALES) {
    const ts = await readFile(join(LOCALES_DIR, `${lang}.ts`), "utf8");
    const locale = parseLocale(ts);
    if (!locale.title) {
      console.error(`prerender: skip ${lang} — could not parse meta.title`);
      continue;
    }
    const html = buildHtml(template, lang, locale);
    const outFile =
      lang === DEFAULT_LOCALE
        ? join(DIST, "index.html")
        : join(DIST, `${lang}.html`);
    await writeFile(outFile, html);
    console.log(
      `prerender: ${lang} → ${outFile.replace(DIST + "\\", "dist/")} (${(html.length / 1024).toFixed(1)} KB)`,
    );
    // The default locale also needs to be served at /<lang>/ (e.g. /en-US/) for
    // platform auto-extension-stripping (Cloudflare Pages) and the nginx
    // rewrite rule. Write a redundant copy with the same content.
    if (lang === DEFAULT_LOCALE) {
      const mirrorFile = join(DIST, `${lang}.html`);
      await writeFile(mirrorFile, html);
      console.log(
        `prerender: ${lang} → ${mirrorFile.replace(DIST + "\\", "dist/")} (${(html.length / 1024).toFixed(1)} KB, mirror)`,
      );
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
