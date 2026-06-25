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

const SEO_PAGES = [
  {
    slug: "compressor",
    title: "Compressor - Private Image Compression in Your Browser",
    description:
      "Use Frog Compress as a private browser compressor for JPG, PNG, WebP, GIF, SVG, and AVIF images. Reduce file size locally before you upload or share.",
    faqs: [
      {
        question: "What can this compressor reduce?",
        answer:
          "It can reduce common image formats including JPG, PNG, WebP, GIF, SVG, and AVIF, with format support depending on your browser.",
      },
      {
        question: "Is this compressor private?",
        answer:
          "Yes. Frog Compress processes supported images in your browser, so files do not leave your device through the app.",
      },
      {
        question: "Can I use it as a JPG compressor?",
        answer:
          "Yes. You can reduce JPG size with quality settings, optional resizing, and a before-and-after comparison before saving.",
      },
    ],
  },
  {
    slug: "image-compressor",
    title: "Image Compressor - Private Browser Image Compression",
    description:
      "Use Frog Compress as a private image compressor for JPG, PNG, WebP, GIF, SVG, and AVIF files. Compress images locally, compare results, and download smaller files.",
    faqs: [
      {
        question: "Is this image compressor online or local?",
        answer:
          "The app runs in the browser and processes supported image files locally. Your images are not sent to a server by Frog Compress.",
      },
      {
        question: "Can it compress JPG and PNG files together?",
        answer:
          "Yes. You can add JPG, PNG, WebP, GIF, SVG, and AVIF files in one batch, then download individual images or one ZIP archive.",
      },
      {
        question: "How is it different from TinyPNG or Compressor.io?",
        answer:
          "Those tools are strong online compressors. Frog Compress is focused on local privacy, batch work, format conversion, and quick before-and-after comparison.",
      },
    ],
  },
  {
    slug: "jpg-size-reducer",
    title: "JPG Size Reducer - Make JPEG Images Smaller Locally",
    description:
      "Reduce JPG size in your browser with Frog Compress. Resize, adjust JPEG quality, compare before and after, and keep image compression private.",
    faqs: [
      {
        question: "Will the JPG look blurry after size reduction?",
        answer:
          "Quality can change with any JPG compression. Frog Compress uses practical defaults and lets you compare the compressed image before saving it.",
      },
      {
        question: "Can I resize a JPG as well as compress it?",
        answer:
          "Yes. You can reduce file size with JPEG quality settings and resize dimensions when the image is larger than needed.",
      },
      {
        question: "Does the JPG size reducer upload my photos?",
        answer:
          "No. Compression runs locally in the browser, so private photos and work images stay on your device.",
      },
    ],
  },
  {
    slug: "tiny-png-alternative",
    title: "TinyPNG Alternative - Local Batch Image Compression",
    description:
      "Compare Frog Compress as a TinyPNG alternative for private local compression, batch image workflows, resize controls, format conversion, and ZIP download.",
    faqs: [
      {
        question: "Why use Frog Compress instead of TinyPNG?",
        answer:
          "Use Frog Compress when local privacy, folder drag-and-drop, batch ZIP download, resize controls, or output format conversion matter more than a simple upload page.",
      },
      {
        question: "Does it work for PNG and JPG?",
        answer:
          "Yes. Frog Compress supports common web image formats including PNG, JPG, WebP, GIF, SVG, and AVIF.",
      },
      {
        question: "Is there a daily upload limit?",
        answer:
          "Frog Compress runs in your browser and does not use a hosted upload queue, so the practical limit is your device and browser memory.",
      },
    ],
  },
  {
    slug: "compressor-io-alternative",
    title: "Compressor.io Alternative - Private Image Compression",
    description:
      "Use Frog Compress as a Compressor.io alternative when you need local image compression, batch handling, before-and-after comparison, and no server upload.",
    faqs: [
      {
        question: "Is Frog Compress a Compressor.io replacement?",
        answer:
          "It can be an alternative when you want local browser compression, batch handling, and no server upload for supported image formats.",
      },
      {
        question: "Can I compare image quality after compression?",
        answer:
          "Yes. Frog Compress includes before-and-after comparison so you can check whether the smaller file still looks acceptable.",
      },
      {
        question: "Does it support batch image compression?",
        answer:
          "Yes. You can add multiple files or folders, compress them together, and download results one by one or as a ZIP.",
      },
    ],
  },
];

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

function buildJsonLd(lang, locale, pagePath = null) {
  const url = pagePath
    ? `${SITE_URL}${pagePath}`
    : lang === DEFAULT_LOCALE
      ? `${SITE_URL}/`
      : `${SITE_URL}/${lang}/`;
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

function buildHtml(template, lang, locale, pagePath = null) {
  let html = template;
  const url = pagePath
    ? `${SITE_URL}${pagePath}`
    : lang === DEFAULT_LOCALE
      ? `${SITE_URL}/`
      : `${SITE_URL}/${lang}/`;

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

  if (pagePath) {
    html = html.replace(/^\s*<link rel="alternate"[^>]*>\s*$/gm, "");
    html = html.replace(
      `<link rel="canonical" href="${url}" />`,
      `<link rel="canonical" href="${url}" />\n    <link rel="alternate" hreflang="x-default" href="${url}" />`,
    );
  } else {
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
  }

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
  const jsonLd = JSON.stringify(buildJsonLd(lang, locale, pagePath), null, 2);
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

  const enTs = await readFile(join(LOCALES_DIR, `${DEFAULT_LOCALE}.ts`), "utf8");
  const enLocale = parseLocale(enTs);
  for (const page of SEO_PAGES) {
    const locale = {
      ...enLocale,
      title: page.title,
      description: page.description,
      faqs: page.faqs,
    };
    const pagePath = `/${page.slug}/`;
    const html = buildHtml(template, DEFAULT_LOCALE, locale, pagePath);
    const outFile = join(DIST, `${page.slug}.html`);
    await writeFile(outFile, html);
    console.log(
      `prerender: ${page.slug} -> ${outFile.replace(DIST + "\\", "dist/")} (${(html.length / 1024).toFixed(1)} KB)`,
    );
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
