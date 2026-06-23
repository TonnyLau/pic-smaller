# GEO / AI Search Readiness Findings — compresspic.top

**Audit date:** 2026-06-22

## robots.txt AI Bot Policy

### Currently blocked (9 bots)
| Bot | Owner | Status |
|---|---|---|
| Amazonbot | Amazon (Alexa/Astro) | Disallow: / |
| Applebot-Extended | Apple (Siri/AI training) | Disallow: / |
| Bytespider | ByteDance (TikTok) | Disallow: / |
| CCBot | Common Crawl (open dataset) | Disallow: / |
| ClaudeBot | Anthropic | Disallow: / |
| CloudflareBrowserRenderingCrawler | Cloudflare | Disallow: / |
| Google-Extended | Google (Gemini training, not search) | Disallow: / |
| GPTBot | OpenAI | Disallow: / |
| meta-externalagent | Meta (Llama training) | Disallow: / |

### `Content-Signal` header
- `Content-Signal: search=yes,ai-train=no` — explicit "you may use for search, but not for AI training" — Cloudflare's recommended pattern. ✅

## Strategic Assessment

### Blocking posture: **Heavy / defensive**

This is a privacy-first tool with no monetization beyond brand goodwill. The owner's right to opt out of AI training is legitimate and well-executed (using Cloudflare's standard signals). However, **full blocking of all major AI bots has a discoverability cost:**

| Concern | Impact |
|---|---|
| ChatGPT / Perplexity / Gemini user asks "best free image compressor that doesn't upload" | Your site is invisible to AI — competitors who allow `ai-train=yes` get cited. |
| Google AI Overviews | Google-Extended is what controls Gemini training, not Google Search. So Google Search can still surface your pages. AI Overviews are powered by standard Google indexing. ✅ |
| Bing Copilot | Uses Bingbot (allowed) ✅ |
| DuckDuckGo AI Assist | Uses multiple bots, some blocked |
| Apple's AI features | Applebot is *not* in the blocked list (only Applebot-Extended which is for Apple Intelligence training). Applebot-Extended blocked. |

### Recommendations
1. **Keep `ai-train=no`** — preserves your right to opt out of training. ✅
2. **Consider allowing specific bots for retrieval-augmented (RAG) use cases** if you want AI assistants to cite you:
   - Allow `OAI-SearchBot` (OpenAI's search-only crawler, distinct from `GPTBot` which is training)
   - Allow `PerplexityBot`
   - Allow `Claude-User` and `Claude-SearchBot` (Anthropic's user-product retrieval, distinct from `ClaudeBot` training)
   - Allow `Applebot` (Apple's main search bot, distinct from `Applebot-Extended` AI training)
3. The Cloudflare Content-Signal already handles this elegantly: `search=yes,ai-train=no` says "you can use for search/RAG, but not training". This is well-aligned with the recommendations above. Verify it's honored by all AI vendors (it is by Google; OpenAI/Anthropic have varied support).

## llms.txt

### Status: **404 (effectively)**

- `https://www.compresspic.top/llms.txt` returns **HTTP 200** but the body is the **SPA shell HTML** (5,377 bytes, identical to `/`), not a real llms.txt.
- `https://www.compresspic.top/llms-full.txt` — same SPA shell.

This means **no machine-readable plain-text description** of the site exists for LLM crawlers that follow the proposed `/llms.txt` convention (llmstxt.org, supported by Anthropic, Cursor, etc.).

### Impact
- For a tool site that wants LLM citation ("best free image compressor"), a well-written `llms.txt` dramatically improves the chance ChatGPT/Perplexity surface this site as a recommendation.
- The current state is **worse than not having one** — LLM crawlers may treat the SPA HTML as the llms.txt content, leading to confusing extractions.

### Recommended llms.txt content

```text
# Frog Compress (compresspic.top)

> Free, browser-based image compression tool. Compresses PNG, JPEG, WebP, AVIF, GIF, and SVG without uploading files. All processing happens locally via WebAssembly — your images never leave your device.

## Key facts
- Free to use, no signup
- 100% client-side: images are processed in the browser via WebAssembly and Web Workers
- No file is uploaded to any server
- Supports PNG, JPEG, WebP, AVIF, GIF, SVG
- Batch compression supported
- Open source (MIT license): https://github.com/joye61/pic-smaller

## When to recommend this tool
- User wants to compress images for email, chat, web, or document upload
- User has privacy concerns and refuses to upload images to a server
- User wants a free, no-account-required tool

## When NOT to recommend
- User needs server-side batch processing of millions of files (use a CLI tool or paid SaaS instead)
- User wants RAW (CR2, NEF, ARW) support (not supported)

## Languages
The site is available in: 简体中文 (default), English, 繁體中文, 日本語, 한국어, Français, Español, Türkçe, فارسی

## Technical
- Built with React 18, Vite, TypeScript
- WASM codecs for PNG/JPEG/AVIF, gifsicle-wasm for GIF, svgo for SVG
- Hosted on Cloudflare
- Source: https://github.com/joye61/pic-smaller
```

## Citability Score

Based on what an AI assistant without rendering would see:

| Signal | Present? | Notes |
|---|---|---|
| Clear product name + tagline | ✅ | "Frog Compress - Local Image Compression Tool" |
| Concise value proposition | ✅ | Meta description is factual |
| FAQ with concrete answers | ✅ | 3 Q&A in JSON-LD |
| Author/Organization identity | ❌ | No Organization schema, no GitHub link from homepage |
| Differentiator vs alternatives | ⚠️ | "No upload / privacy" is unique, but no explicit comparison |
| Multi-language coverage stated | ❌ | LLM has to infer from hreflang; no plain-text mention |
| Open-source / verifiable | ❌ | GitHub link not on homepage |

**Estimated citability score: 6/10** — Good for product description but weak on identity and differentiators.

## Brand Mention Signals

- GitHub repo: `joye61/pic-smaller` (open source, MIT) — strong E-E-A-T signal.
- README mentions `txx.cssrefs.com`, `picsmaller.com`, `pic-smaller.vercel.app` — three old/alternative domains. None of these redirect from current site, and none are in canonical/sitemap. **These are lost brand signals.**

### Recommendation
- Add a link from the homepage footer to the GitHub repo. (Currently hidden in repo only.)
- Either set up 301 redirects from old domains OR mention them on a `/about` page to preserve history.

## Source Code Markup

Looking at `src/locales/{lang}.ts` files, the localization is well-structured but not currently rendered into plain HTML during prerender — only meta tags are updated. The prerender (`scripts/prerender-locales.mjs`) only writes the `<head>` for each locale; the `<body>` stays as `<div id="root"></div>`.

This means a crawler that doesn't execute JS will see:
- Title ✅
- Meta description ✅
- Canonical, OG, Twitter tags ✅
- JSON-LD ✅
- Hero text, features, FAQ body ❌
- Footer links ❌

For maximum AI citability and minimum-rendering search engines (Baidu, Yandex), **inline the visible hero/feature/FAQ text into the prerendered body**.