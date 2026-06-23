# Action Plan — compresspic.top

**Generated:** 2026-06-22
**Health Score:** 72 / 100
**Total findings:** 22 (5 Critical/High, 12 Medium, 5 Low/Info)

This document is the actionable, prioritized list. Each item includes severity, owner, effort estimate, and concrete next steps. Items are grouped into 4 phases.

---

## Phase 1: Critical Fixes (Week 1)

These are blocking issues that hurt indexing, crawl budget, or duplicate detection. Fix immediately.

### 1.1 Resolve canonical / www host mismatch  `[Critical]`
**Owner:** Engineering
**Effort:** 1–2 hours
**Why:** Both `compresspic.top` and `www.compresspic.top` return 200 with self-referencing canonicals, so Google has to pick one and may flip-flop between them. Two copies of every page in the index.

**Steps:**
1. Decide canonical host. **Recommendation: keep `www.compresspic.top`** (this is where users actually land via the Cloudflare deployment).
2. Add a Cloudflare redirect rule (Bulk Redirects or Transform Rule):
   - From: `https://compresspic.top/*`
   - To: `https://www.compresspic.top/:splat`
   - Status: `301` (permanent)
3. Update canonical, hreflang, sitemap `<loc>`, OG/Twitter URLs to use `www.compresspic.top`:
   - In `scripts/generate-sitemap.mjs` and `scripts/prerender-locales.mjs`, change `SITE_URL` constant (or its usages) to `https://www.compresspic.top`.
4. Re-deploy, then verify:
   - `curl -I https://compresspic.top/` → 301 with `location: https://www.compresspic.top/`
   - `curl -s https://www.compresspic.top/ | grep canonical` → `https://www.compresspic.top/`
   - `curl -s https://www.compresspic.top/sitemap.xml | grep '<loc>'` → `https://www.compresspic.top/...`
5. Re-submit sitemap in Google Search Console.

### 1.2 Resolve trailing-slash 307 redirect  `[High]`
**Owner:** Engineering
**Effort:** 30 minutes
**Why:** Sitemap and canonical declare `/en-US/` (with slash), but server 307s `/en-US/` → `/en-US` (no slash). Google fetches the canonical URL, gets a redirect, then lands on the actual content. Wastes crawl budget and confuses canonical-target verification.

**Steps:**
1. Pick the canonical slash form. **Recommendation: no slash** (`/en-US`).
2. In Cloudflare Pages, ensure no rule redirects `/en-US/` → `/en-US`. (The 307 currently being served may be from `_redirects` file or a Cloudflare rule — investigate.)
3. Update `scripts/prerender-locales.mjs` to generate `<loc>` entries without trailing slash.
4. Update canonical and hreflang URLs in the same script to no-slash.
5. Re-deploy, verify:
   - `curl -I https://www.compresspic.top/en-US/` → 200 (no longer 307)
   - `curl -I https://www.compresspic.top/en-US` → 200
6. Re-submit sitemap.

### 1.3 Configure 404 handling for non-existent paths  `[High]`
**Owner:** Engineering
**Effort:** 1 hour
**Why:** Any URL returns 200 with the SPA shell, so search engines can index phantom pages (`/about`, `/privacy`, `/blog`, etc.) as duplicates of the homepage.

**Steps:**
1. In Cloudflare Pages, create `_redirects` file (or update existing):
   ```
   # Anything not matching a locale path returns 404
   /:lang  /404.html  404
   ```
   with a regex pattern that excludes `^/$` and `^/(en-US|zh-TW|ja-JP|ko-KR|fr-FR|es-ES|tr-TR|fa-IR)$`.
2. Verify the `dist/404.html` (already exists locally, 854 bytes) is being deployed.
3. Test:
   - `curl -I https://www.compresspic.top/about` → should be 404 with `404.html` body
   - `curl -I https://www.compresspic.top/en-US` → still 200
4. Optionally: keep the SPA shell fallback for non-locale paths but with a `<meta name="robots" content="noindex">` injected, returning 200 only for the homepage and locale paths.

### 1.4 Create a real `/llms.txt`  `[High]`
**Owner:** Content / Marketing
**Effort:** 30 minutes
**Why:** `/llms.txt` currently returns the SPA shell HTML. LLM crawlers following the llmstxt.org convention (Anthropic, OpenAI, Cursor, Windsurf) extract garbage. This is worse than not having one.

**Steps:**
1. Write a plain-text `llms.txt` describing the site for LLMs. Suggested content:
   ```
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
2. Add to `scripts/prerender-locales.mjs` so each locale gets a localized variant (`/llms-en-US.txt`, etc.), and the main `/llms.txt` defaults to English.
3. Add a Cloudflare Pages redirect: `/llms.txt` → `/llms-en-US.txt` (or set `/llms.txt` to the en-US content).
4. Validate: `curl https://www.compresspic.top/llms.txt` returns plain text, not HTML.

---

## Phase 2: High-Impact Improvements (Weeks 2–3)

### 2.1 Long-cache hashed static assets  `[Medium]`
**Owner:** Engineering
**Effort:** 30 minutes
**Why:** Hashed assets (`index-CyHHZpPs.js`, `frog-hero-bg-1600.webp`) return `cache-control: public, max-age=0`. Returning users re-download 581 KB JS every visit.

**Steps:**
1. Create `public/_headers` file in the project (Cloudflare Pages convention):
   ```
   /assets/*
     Cache-Control: public, max-age=31536000, immutable
   ```
2. Or, in Cloudflare dashboard: Caching → Cache Rules → add a rule for `/assets/*` with the above cache-control header.
3. For HTML, robots.txt, and sitemap.xml, use shorter TTL (e.g. `Cache-Control: public, max-age=300`) so updates propagate within 5 minutes.
4. Verify: `curl -I https://www.compresspic.top/assets/index-CyHHZpPs.js` shows new header.

### 2.2 Preload hero image and main JS bundle  `[High]`
**Owner:** Engineering
**Effort:** 30 minutes
**Why:** LCP waits for HTML → JS parse → image fetch. Preload hints let the browser fetch in parallel.

**Steps:**
1. In `scripts/prerender-locales.mjs`, after the existing `<link rel="preconnect">` for GA, add:
   ```html
   <link rel="preload" as="image" href="/assets/frog-hero-bg-1600.webp" type="image/webp" imagesrcset="/assets/frog-hero-bg-800.webp 800w, /assets/frog-hero-bg-1200.webp 1200w, /assets/frog-hero-bg-1600.webp 1600w" imagesizes="100vw">
   <link rel="modulepreload" href="/assets/index-CyHHZpPs.js">
   ```
2. Combine with F2.7 (responsive hero variants) — only preload one size on mobile to avoid wasted bandwidth.
3. Re-deploy, verify with Lighthouse (after Phase 1 fixes unblock CWV measurement).

### 2.3 Expand CJK meta descriptions  `[Medium]`
**Owner:** Content
**Effort:** 30 minutes
**Why:** zh-CN 45 chars, zh-TW 43 chars, ja-JP 74 chars — all below the 90–155 char sweet spot.

**Steps:**
1. Edit `src/locales/zh-CN.ts` `homeContent.meta.description` — expand to 80–120 chars.
   Example: `青蛙压缩是一款免费在线图片压缩工具，支持 PNG、JPEG、WebP、AVIF、GIF、SVG 等格式。所有处理都在浏览器本地完成，图片不上传服务器，保护隐私，可批量压缩，日常发送、上传网页都能用。`
2. Same for `src/locales/zh-TW.ts` and `src/locales/ja-JP.ts`.
3. Re-build and re-deploy.
4. Verify with `curl -s https://www.compresspic.top/ | grep description`.

### 2.4 Inline visible body content in prerender  `[High]`
**Owner:** Engineering
**Effort:** 2–3 hours
**Why:** Pre-rendered HTML has only `<div id="root"></div>` in body. Hero, features, FAQ body are all client-rendered. Crawlers without JS see only the meta description.

**Steps:**
1. Read `src/locales/{lang}.ts` to identify the visible text fields: hero title, hero subhead, feature list, FAQ Q&A.
2. In `scripts/prerender-locales.mjs`, after injecting `<head>` content, also inject a parallel non-hydrated body block:
   ```html
   <body>
     <div id="root"></div>
     <noscript>
       <h1>{heroTitle}</h1>
       <p>{heroSubhead}</p>
       <h2>Features</h2>
       <ul><li>{feature1}</li>...</ul>
       <h2>FAQ</h2>
       <dl>{faqItems}</dl>
     </noscript>
   </body>
   ```
3. Alternative: insert a hidden-but-crawlable block (`<div style="position:absolute;left:-9999px">`) so JS users see the React app, but crawlers extract the content. Less disruptive than `<noscript>`.
4. Validate with `curl -s https://www.compresspic.top/` — H1 should appear in body.

### 2.5 Add security headers via Cloudflare Transform Rules  `[Medium]`
**Owner:** Engineering
**Effort:** 1 hour
**Why:** No CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy.

**Steps:**
1. In Cloudflare dashboard: Rules → Transform Rules → Modify Response Header.
2. Add a rule matching all requests (`http.request.uri eq "*"`):
   - Set `X-Content-Type-Options: nosniff`
   - Set `Referrer-Policy: strict-origin-when-cross-origin`
   - Set `X-Frame-Options: DENY`
   - Set `Permissions-Policy: camera=(), microphone=(), geolocation=()`
3. Verify HSTS is on: SSL/TLS → Edge Certificates → HSTS → enable.
4. For CSP, start in report-only mode (Report-Only header pointing to a logging endpoint) — strict CSP is hard with GA + WASM + Antd CSS-in-JS.
5. Verify with `curl -I https://www.compresspic.top/`.

---

## Phase 3: Content & Authority (Month 2)

### 3.1 Expand FAQ to 6–10 Q&A pairs  `[Low]`
**Owner:** Content
**Effort:** 2 hours
**Why:** Only 3 Q&A currently. AI crawlers extract these heavily (Google rich results policy is restricted for non-government sites, but AI uses FAQ heavily).

**Steps:**
1. Brainstorm 6–10 common questions: supported formats, max file size, batch limits, browser compatibility, mobile support, comparison vs TinyPNG/Squoosh, troubleshooting.
2. Add to `homeContent.faqs` in each locale's `src/locales/{lang}.ts`.
3. Update `scripts/prerender-locales.mjs` to write all Q&A into the JSON-LD `mainEntity` array.
4. Re-deploy, validate with Google Rich Results Test.

### 3.2 Enrich SoftwareApplication schema  `[Medium]`
**Owner:** Engineering
**Effort:** 1 hour
**Why:** Missing author, datePublished, softwareVersion. Google cannot link to author identity.

**Steps:**
1. In `scripts/prerender-locales.mjs`, add to the SoftwareApplication block:
   ```json
   "author": {
     "@type": "Organization",
     "name": "joye61",
     "url": "https://github.com/joye61/pic-smaller"
   },
   "datePublished": "2024-01-01",
   "softwareVersion": "1.1.0",
   "featureList": [
     "Local compression",
     "No server upload",
     "Multiple formats (PNG, JPEG, WebP, AVIF, GIF, SVG)",
     "Batch compression",
     "Open source (MIT license)"
   ]
   ```
2. Add a separate `Organization` schema block (not in @graph):
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Organization",
     "name": "joye61",
     "url": "https://github.com/joye61/pic-smaller",
     "logo": "https://www.compresspic.top/logo.svg"
   }
   ```
3. Validate with Google Rich Results Test.

### 3.3 Add About and Privacy Policy pages  `[Medium]`
**Owner:** Content
**Effort:** 4 hours
**Why:** No author identity, no privacy policy visible. Limits E-E-A-T and trust signals.

**Steps:**
1. Create `src/pages/About.tsx` and `src/pages/Privacy.tsx`.
2. Add localized content in `src/locales/{lang}.ts` under `aboutContent` and `privacyContent`.
3. Configure prerender to also output `/about.html`, `/about-en-US.html`, etc. Or, since the site is an SPA, configure Cloudflare Pages routes for `/about` to serve a static HTML shell.
4. Add to sitemap.xml (3.7).
5. Link from footer in prerendered body (visible in static HTML).
6. Test:
   - `curl -s https://www.compresspic.top/about` returns the localized About HTML

### 3.4 Add 3–5 use-case landing pages  `[Low]`
**Owner:** Content + Engineering
**Effort:** 1–2 days
**Why:** Single indexable page per locale limits long-tail keyword coverage. Use-case pages create additional indexable URLs.

**Steps:**
1. Pick 3–5 use cases:
   - `/compress-for-email` (targeting email attachment size limits)
   - `/compress-for-web` (targeting web performance / Core Web Vitals)
   - `/compress-for-whatsapp` (targeting chat app size limits)
   - `/png-vs-webp` (educational content)
2. Each page: hero, 2–3 features, 2 FAQ, internal links back to `/`.
3. Pre-render with localized title, description, FAQ schema, OG tags.
4. Add to sitemap.
5. Internal linking between pages (e.g. footer of `/compress-for-email` links to `/compress-for-web`).

### 3.5 Allow retrieval-only AI bots  `[Medium]`
**Owner:** Engineering
**Effort:** 30 minutes
**Why:** Currently all major AI training crawlers are blocked. This preserves training opt-out, but also blocks AI assistants from citing the site.

**Steps:**
1. Update `robots.txt` to allow retrieval-only bots:
   ```
   User-agent: OAI-SearchBot
   Allow: /
   Content-Signal: search=yes,ai-train=no

   User-agent: PerplexityBot
   Allow: /
   Content-Signal: search=yes,ai-train=no

   User-agent: Claude-User
   Allow: /
   Content-Signal: search=yes,ai-train=no

   User-agent: Claude-SearchBot
   Allow: /
   Content-Signal: search=yes,ai-train=no

   User-agent: Applebot
   Allow: /
   Content-Signal: search=yes,ai-train=no
   ```
2. Keep `Disallow: /` for `GPTBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, `CCBot`, `Bytespider`, `meta-externalagent`, `Amazonbot` (training-only bots).
3. Monitor AI referral traffic in GA4 over the next quarter.
4. Optionally track AI citation by manually querying ChatGPT, Perplexity, Claude for "best free image compressor that doesn't upload" and seeing if your site is cited.

### 3.6 Responsive hero image variants  `[Medium]`
**Owner:** Engineering
**Effort:** 2 hours
**Why:** 109 KB hero served to all viewports. Mobile users pay for desktop-sized assets.

**Steps:**
1. Add a build step (or `scripts/optimize-hero.mjs` already exists — extend it) to generate 800w and 1200w WebP variants.
2. In prerender, use `<picture>` element in the body (or in CSS for background-image):
   ```html
   <picture>
     <source media="(min-width: 1200px)" srcset="/assets/frog-hero-bg-1600.webp">
     <source media="(min-width: 768px)" srcset="/assets/frog-hero-bg-1200.webp">
     <img src="/assets/frog-hero-bg-800.webp" alt="..." width="1600" height="686">
   </picture>
   ```
3. Keep the 1600w variant for OG/social cards.
4. Re-deploy, test with Lighthouse mobile.

### 3.7 Code-split Antd per component  `[Medium]`
**Owner:** Engineering
**Effort:** 1 day
**Why:** Main JS chunk is 581 KB (188 KB gzipped). Antd barrel imports contribute most of the bloat.

**Steps:**
1. Audit `src/` for `import { ... } from 'antd'` patterns.
2. Replace with direct imports:
   ```ts
   import Button from 'antd/es/button'
   import Slider from 'antd/es/slider'
   ```
3. Same for `@ant-design/icons` — only import icons actually used.
4. Verify build size with `npm run build` (look for `dist/assets/index-*.js` size).
5. Target: < 300 KB gzipped main bundle.
6. If Antd version is upgradable, check if v5.x has better tree-shaking in newer releases.

---

## Phase 4: Monitoring & Iteration (Ongoing)

### 4.1 Set up Google Search Console monitoring  `[Info]`
**Owner:** Marketing
**Effort:** 1 hour

**Steps:**
1. Verify `https://compresspic.top/` in GSC.
2. Submit `sitemap.xml` (after Phase 1 fixes).
3. Monitor Coverage report for:
   - Duplicate canonical issues
   - 404 spike (after F1.3 implementation)
   - Discovered but not indexed URLs
4. Monitor Enhancements report for FAQ, Breadcrumbs (when added).
5. Monitor Core Web Vitals (mobile + desktop) once sufficient traffic.

### 4.2 Set up Bing Webmaster Tools  `[Info]`
**Owner:** Marketing
**Effort:** 30 minutes

**Steps:**
1. Sign up at bing.com/webmasters.
2. Verify `https://compresspic.top/`.
3. Submit sitemap.
4. Optional: add `<meta name="msvalidate.01" content="...">` for ownership.

### 4.3 Monitor AI citations  `[Info]`
**Owner:** Marketing
**Effort:** Ongoing (1 hour per quarter)

**Steps:**
1. Manually query ChatGPT, Perplexity, Claude, Gemini: "best free image compressor that doesn't upload", "图片压缩不损画质", "AVIF vs WebP compression" — check if your site is cited.
2. Set up GA4 referral segments for `chat.openai.com`, `perplexity.ai`, `claude.ai`, `gemini.google.com`, `copilot.microsoft.com`.
3. If citations are happening, expand `llms.txt` to address more specific queries.
4. Track which AI crawlers are visiting (server logs) — should now include the retrieval-only bots enabled in F3.5.

### 4.4 Quarterly Lighthouse audit  `[Info]`
**Owner:** Engineering
**Effort:** 1 hour per quarter

**Steps:**
1. Run `npx lighthouse https://www.compresspic.top/ --view` (mobile + desktop).
2. Track LCP, INP, CLS trends.
3. Compare against CrUX field data (after 28 days of sufficient traffic).
4. Re-prioritize based on findings.

### 4.5 Set up Content-Signal monitoring  `[Info]`
**Owner:** Engineering
**Effort:** 1 hour

**Steps:**
1. Verify the `Content-Signal: search=yes,ai-train=no` header is sent.
2. Monitor server logs for compliance — should AI vendors respect the signal? (They do for the most part, but check periodically.)
3. If a vendor ignores `ai-train=no`, escalate to that vendor.

---

## Summary: Estimated Total Effort

| Phase | Total effort | Who |
|---|---|---|
| Phase 1: Critical Fixes | ~3.5 hours | Eng + Content |
| Phase 2: High-Impact Improvements | ~5 hours | Eng + Content |
| Phase 3: Content & Authority | ~4–5 days | Eng + Content |
| Phase 4: Monitoring & Iteration | ~3 hours/quarter | Marketing + Eng |

**Total to ship Phase 1+2:** ~1 working day spread over 1–3 weeks.
**Total to ship Phase 3:** ~1–2 weeks of focused work.

## Top 3 Quickest Wins (do today)

1. **Add `<link rel="preload" as="image" href="/assets/frog-hero-bg-1600.webp">` and `<link rel="modulepreload" href="/assets/index-CyHHZpPs.js">` to `<head>`.** 5 minutes. Saves 200–500ms on LCP.

2. **Add `Cache-Control: public, max-age=31536000, immutable` to `/assets/*`** via Cloudflare Cache Rule. 10 minutes. Improves repeat-visit performance.

3. **Create `/llms.txt`** with the suggested content above. 30 minutes. Improves AI citation readiness.