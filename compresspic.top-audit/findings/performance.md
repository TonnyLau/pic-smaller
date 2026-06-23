# Performance Findings — compresspic.top

**PSI API access:** Rate-limited during this audit (240 QPM cap). Lab Lighthouse scores unavailable. Findings based on raw asset inspection + best-effort estimation.

## Asset Inventory

| Asset | Size (raw) | Size (gzip) | Cache-Control | Notes |
|---|---|---|---|---|
| HTML (zh-CN) | 5,377 B | 1,623 B | `public, max-age=0, must-revalidate` | Pre-rendered shell |
| HTML (en-US) | 5,459 B | — | same | |
| HTML (zh-TW) | 5,380 B | — | same | |
| HTML (ja-JP) | 5,830 B | — | same | |
| HTML (ko-KR) | 5,888 B | — | same | |
| HTML (fr-FR) | 5,663 B | — | same | |
| HTML (es-ES) | 5,555 B | — | same | |
| HTML (tr-TR) | 5,765 B | — | same | |
| HTML (fa-IR) | 6,624 B | — | same | Slightly larger due to RTL CSS |
| `index-CyHHZpPs.js` | 581,313 B | 187,411 B | `public, max-age=0` | React + Antd + locale runtime |
| `index-Dm8o0EIW.css` | 5,045 B | 1,670 B | `public, max-age=0` | |
| `frog-hero-bg-1600.webp` | 108,758 B | n/a | `public, max-age=0` | Already WebP, 1600×686 |
| `WorkerCompress-CPF2w-Wp.js` | 121 B | — | `public, max-age=0` | Stub that imports the real worker |
| Locale chunks (9 files) | ~5–20 KB each | — | `public, max-age=0` | en-US, zh-CN, etc. |

## Core Web Vitals (estimates — no field data)

Without PSI field data, these are rough estimates from first principles:

### LCP (Largest Contentful Paint)
- **Element:** Hero background WebP, 109 KB
- **No preload hint** for the hero image — adds RTT delay
- **JS bundle must parse** before React hydrates and inserts the hero into the visible layer
- **Estimated LCP:** 1.8–2.8s on a 4G mobile connection (no field data)
- **Target:** < 2.5s (Good)
- **Likely status:** Borderline. **Improve.**

### CLS (Cumulative Layout Shift)
- Single hero image, no late-loading fonts visible in HTML
- **Estimated CLS:** ~0.00–0.05 — **Good**
- ✅ This is unlikely to be an issue.

### INP (Interaction to Next Paint)
- The page is mostly upload + compress; not many click handlers
- Antd components add some interaction overhead
- **Estimated INP:** 100–250ms on mid-tier mobile — **likely Good**
- Cannot verify without field data.

## Performance issues

### 1. [High] No preconnect/preload hints for critical assets
- **Current preconnect:** only `https://www.googletagmanager.com`
- **Missing:**
  - `<link rel="preload" as="image" href="/assets/frog-hero-bg-1600.webp" type="image/webp">` — saves 100–300ms on LCP
  - `<link rel="modulepreload" href="/assets/index-CyHHZpPs.js">` — saves a round-trip on the main JS chunk
- **Impact:** Hero render waits for HTML → JS parse → fetch image sequence. Preload hints enable the browser to start the image fetch in parallel with HTML parsing.

### 2. [High] No long-term caching on hashed assets
- **Evidence:** Every asset returns `cache-control: public, max-age=0, must-revalidate`.
- **Reality:** Filenames contain content hashes (`index-CyHHZpPs.js`, `WorkerCompress-CPF2w-Wp.js`). They never change for a given content version.
- **Impact:** Returning users re-download 581 KB JS every visit. With Cloudflare's `cf-cache-status: HIT` the cost is mostly at the user's browser cache miss, but still wasteful.
- **Fix:** Add a Cloudflare `_headers` file or Transform Rule for `/assets/*`:
  ```
  Cache-Control: public, max-age=31536000, immutable
  ```

### 3. [Medium] Antd shipped as full bundle
- **Evidence:** Main JS is 581 KB raw / 188 KB gzipped. Antd 5.x CSS-in-JS adds runtime overhead even when tree-shaken.
- **Recommendation:** Use Antd's babel-plugin-import or import specific components directly (`import Button from 'antd/es/button'`). Audit `src/` for direct `antd` barrel imports.

### 4. [Medium] No `font-display: swap` or preloaded fonts visible
- No web fonts detected in the prerendered HTML — system font stack.
- ✅ This is actually fine — no FOUT/FOIT.

### 5. [Medium] Hero image not optimized for mobile
- The hero WebP is 1600×686 — appropriate for desktop, oversized for mobile.
- **Recommendation:** Serve a smaller `frog-hero-bg-800.webp` (or use `<picture>` with `srcset`) for viewports < 768px. Could save ~60% bytes on mobile LCP.

### 6. [Low] Worker JS files appear as tiny stubs (121 B, 120 B)
- These stubs just re-export from a different module — fine, but consider inlining into the main bundle if small enough.

### 7. [Low] `cf-ray` indicates requests are routed through LAX/SJC/LHR Cloudflare POPs
- The audit's Cloudflare POPs vary (LAX, SJC, LHR), suggesting Cloudflare's anycast routing. For Chinese users (the primary audience), CF's Shanghai/Hong Kong/Singapore POPs should serve — verify with `dig +short` or `curl -v` from a Chinese IP if performance matters.

## Compression

- ✅ Gzip enabled on all text responses (HTML, JS, CSS)
- Compression ratio: ~67–70% across the board
- ✅ Could consider Brotli (`Content-Encoding: br`) — Cloudflare auto-negotiates Brotli for browsers that support it (most modern). Verify in response headers from a Brotli-capable client.

## Recommendations summary

| # | Action | Effort | CWV impact |
|---|---|---|---|
| 1 | Add `preload` for hero image + `modulepreload` for main JS | 30 min | LCP -200–500ms |
| 2 | Long-cache `/assets/*` (immutable) | 15 min | TTI on repeat visits -500ms |
| 3 | Code-split Antd per component | 2 hours | Initial JS -100–200KB |
| 4 | Serve responsive hero (`srcset`) | 1 hour | Mobile LCP -300ms |
| 5 | Inline visible body content in prerender | 1 hour | Helps SEO + first-paint perception |
| 6 | Inline critical CSS | 30 min | FCP -100–200ms |