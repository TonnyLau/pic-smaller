# Technical SEO Findings — compresspic.top

**Crawl date:** 2026-06-22
**Stack:** Cloudflare (CDN/WAF), React SPA with prerendered locale shells, Vite build
**PageSpeed Insights API:** rate-limited during this audit (240 QPM cap reached); PSI-based CWV not available. CrUX field data not available without API key.

## Crawlability & Indexability

### 1. [Critical] Canonical points to non-www URL, but server responds at www
- **Evidence:** Every page's `<link rel="canonical">` and `<link rel="alternate" hreflang>` use `https://compresspic.top/...` (no `www`).
- **Reality:** The server actually serves pages at `https://www.compresspic.top/...` and 200s the no-www version too (no redirect).
- **Impact:** Two indexable versions of every page (`compresspic.top/x` and `www.compresspic.top/x`) with self-referencing canonicals. Google has to pick one and may flip-flop between them.
- **Fix:** Pick one host. Either:
  - Set Cloudflare redirect rule: `compresspic.top/*` → `301` → `https://www.compresspic.top/:splat`, **or**
  - Update canonical, hreflang, sitemap `<loc>`, and OG/Twitter URLs to use `www.compresspic.top`. Recommended: keep `www` as canonical (already the de-facto host users see) and 301 the apex.

### 2. [High] Trailing-slash redirect (307) wastes crawl budget and confuses canonical/sitemap
- **Evidence:**
  - `https://www.compresspic.top/en-US/` returns **307 → `https://www.compresspic.top/en-US`** (stripping trailing slash).
  - All 8 locale URLs follow this same pattern.
  - But sitemap.xml and `<link rel="canonical">` declare URLs **with** the trailing slash (`compresspic.top/en-US/`).
- **Impact:** Sitemap entries don't match the URLs Google actually ends up at; canonical declared URL is unreachable directly (forces a 307 redirect before getting to the canonical target).
- **Fix:** Either commit to the no-slash form (redirect `/en-US/` → `/en-US` **and** update sitemap + canonical to `compresspic.top/en-US`), or commit to slash form (remove the 307, redirect the reverse direction, and keep sitemap/canonical with slash).

### 3. [High] All unknown URLs return 200 with the SPA shell (no 404 handling)
- **Evidence:** Tested paths `/about`, `/privacy`, `/terms`, `/contact`, `/blog`, `/help`, `/random-nonexistent-page` all return HTTP 200 with `content-length: 5377` (the index.html shell).
- **Reality:** A `dist/404.html` exists locally but is not being served.
- **Impact:** Search engines can index the same content under unlimited URL variations → duplicate content dilution. Crawl budget wasted on phantom pages.
- **Fix:** Configure Cloudflare Pages or Worker to serve `404.html` with **HTTP 404** for any path that doesn't match the locale pattern (`^/$`, `^/(en-US|zh-TW|ja-JP|ko-KR|fr-FR|es-ES|tr-TR|fa-IR)$`). For the SPA shell fallback at non-locale paths, return the 404 status so search engines don't index them.

### 4. [Medium] Static asset caching uses `max-age=0, must-revalidate`
- **Evidence:** Every response — HTML, JS, CSS, WebP, robots.txt — sends `cache-control: public, max-age=0, must-revalidate`.
- **Reality:** Asset filenames contain content hashes (`assets/index-CyHHZpPs.js`), so they're effectively immutable.
- **Impact:** Returning users revalidate every request → slower LCP, more Cloudflare egress.
- **Fix:** Split cache policy:
  - `/_redirects` rule or `_headers` for `/assets/*` → `public, max-age=31536000, immutable`
  - For HTML and `robots.txt`/`sitemap.xml` → keep short TTL (e.g. `public, max-age=300`) so updates propagate fast.

### 5. [Medium] `X-Content-Type-Options`, CSP, Referrer-Policy, Permissions-Policy not set
- **Evidence:** Response headers include only `content-type`, `cache-control`, `cf-*`, `nel`, `report-to`, `server`, `alt-svc`. No `content-security-policy`, `strict-transport-security` (note: HSTS may be set by Cloudflare's "Always Use HTTPS" toggle — verify in dashboard), `x-frame-options`, `x-content-type-options: nosniff`, `referrer-policy`.
- **Impact:** Not a ranking factor, but minor security gaps and missing browser hardening. CSP also helps AI scrapers understand allowed sources.
- **Fix:** Add to Cloudflare response headers (Transform Rules):
  - `X-Content-Type-Options: nosniff`
  - `Referrer-Policy: strict-origin-when-cross-origin`
  - `X-Frame-Options: DENY`
  - `Permissions-Policy: camera=(), microphone=(), geolocation=()`
  - `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload` (if HSTS not already on)

### 6. [Low] Pre-render bundles all 9 locales in the main JS chunk
- **Evidence:** `assets/index-CyHHZpPs.js` is 581 KB (188 KB gzipped). It contains imports for all 9 locale chunks (`en-US-XZqHz1c6.js`, `fr-FR-C7zzUreQ.js`, …).
- **Impact:** First-paint parse cost is high. Locale-specific text is split into per-locale chunks (good) but the main chunk still pulls all i18n runtime code.
- **Fix:** Code-split locale dictionaries by route. The static-prerender already provides locale-specific meta; pair it with a dynamic `import('./locales/{lang}')` based on the URL.

### 7. [Info] Single SPA shell returns 200 for every locale path
- **Evidence:** `https://www.compresspic.top/en-US` returns 200 with locale-specific pre-rendered HTML (`en-US.html` content). The build artifact `dist/` contains `index.html`, `en-US.html`, `ja-JP.html`, … — and Cloudflare Pages is serving them. Good.
- **Note:** No `hreflang="x-default"` for English. The site uses `zh-CN` as x-default and English as `en-US`. This is fine if the site is primarily Chinese, but be aware: English-speaking users landing on a `/` URL get the Chinese page.

## Sitemap

- URL count: 9 (homepage + 8 locales).
- Each `<loc>` has trailing slash; canonical has trailing slash; server serves no-slash.
- All entries use non-www host, conflicting with served location.
- `<lastmod>2026-06-22</lastmod>` (today) — possibly auto-generated each build, which is misleading.
- `<changefreq>monthly</changefreq>` and `<priority>` are present (mostly ignored by Google but used by Bing/Yandex).
- **Recommendations:**
  - Align host (www vs no-www) with canonical decision.
  - Align trailing slash with server reality.
  - Drop `<changefreq>` and `<priority>` (Google ignores them).
  - Drop or make `<lastmod>` accurate to actual content changes.

## robots.txt

- Sitemap reference at bottom: ✅ `Sitemap: https://compresspic.top/sitemap.xml` (non-www, no trailing slash — different from sitemap's own URLs).
- User-agent `*` allows full crawl.
- `Disallow: /assets/*.wasm$` — keeps WASM payload out of crawl budget. Good.
- **All major AI bots blocked** (Amazonbot, Applebot-Extended, Bytespider, CCBot, ClaudeBot, CloudflareBrowserRenderingCrawler, Google-Extended, GPTBot, meta-externalagent) — see GEO findings.
- `Content-Signal: search=yes,ai-train=no` is set — Cloudflare's standard "search yes, AI training no" pattern. ✅

## Performance (lab estimates — no PSI field data)

| Asset | Raw | Gzipped | Note |
|---|---|---|---|
| HTML (zh-CN) | 5.4 KB | 1.6 KB | Pre-rendered, minimal |
| JS main (`index-*.js`) | 581 KB | 188 KB | Contains React + Antd + 9-locale runtime |
| CSS | 5 KB | 1.7 KB | Minimal |
| Hero image (WebP) | 109 KB | n/a | Already optimized, 1600×686 |
| Worker JS chunks | ~120 B each | n/a | Dynamic loaded |

### Estimated Core Web Vitals (mobile, 4G, no field data)
- **LCP:** Likely 1.5–2.5s. The 188 KB gzipped JS has to parse before the hero renders. Hero WebP is 109 KB and not preloaded.
- **CLS:** Should be near 0 — single hero image, no late-loading fonts visible.
- **INP:** Hard to estimate without PSI. Antd is heavy (CSS-in-JS), but for a tool app the interaction is mostly upload+download, not click handlers.

### Performance recommendations
1. **Preload hero image** — add `<link rel="preload" as="image" href="/assets/frog-hero-bg-1600.webp" type="image/webp">` to the head. Currently only GA is preconnected.
2. **Code-split per locale** — already partially done; remove the main bundle's reference to all 9 locale dictionaries.
3. **Lazy-load Antd components** — tree-shake Ant Design; the bundle currently ships the full Antd CSS-in-JS.
4. **Static asset long cache** — see finding #4.

## Security headers summary

| Header | Status |
|---|---|
| HTTPS | ✅ Cloudflare enforces |
| HSTS | ⚠️ Not in response — verify Cloudflare "Always Use HTTPS" / HSTS toggle in dashboard |
| X-Frame-Options / frame-ancestors | ❌ Missing |
| X-Content-Type-Options | ❌ Missing |
| Content-Security-Policy | ❌ Missing |
| Referrer-Policy | ❌ Missing |
| Permissions-Policy | ❌ Missing |