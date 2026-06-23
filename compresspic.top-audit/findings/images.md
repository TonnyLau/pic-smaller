# Images Audit — compresspic.top

**Audit date:** 2026-06-22

## Image Inventory (declared in prerendered HTML)

| Image | Format | Dimensions | Bytes | Used as |
|---|---|---|---|---|
| `/logo.svg` | SVG | vector | 1,112 B | Favicon |
| `/assets/frog-hero-bg-1600.webp` | WebP | 1600 × 686 | 108,758 B | OG image + hero background |

That's it. The static HTML references only two images.

## Findings

### 1. [Info] Hero image is already optimized
- ✅ WebP format (vs JPEG/PNG which would be larger)
- ✅ Sensible dimensions for hero (1600×686)
- ✅ Has OG image dimensions, type, alt attributes

### 2. [Medium] No responsive variants for hero
- Same 109 KB WebP is served to mobile and desktop.
- **Recommendation:** Generate smaller variants:
  - `frog-hero-bg-800.webp` (~50 KB) for viewports < 768px
  - `frog-hero-bg-1200.webp` (~75 KB) for 768–1440px
  - `frog-hero-bg-1600.webp` (109 KB) for > 1440px and OG images
- Use `<picture>` with `<source media="..." srcset="...">` for art direction, or `srcset` + `sizes` for resolution switching.
- **Estimated savings:** 30–50% on mobile LCP.

### 3. [Info] No alt text visible in prerendered HTML body
- The hero image is rendered client-side (background-image or `<img>` set by React after hydration). The prerendered HTML doesn't include any `<img>` tag.
- For accessibility, AI crawlers, and screen readers, the alt text needs to be in the rendered DOM.
- **Recommendation:** In `scripts/prerender-locales.mjs`, add `<img src="/assets/frog-hero-bg-1600.webp" alt="[localized alt]" width="1600" height="686">` to the body, with proper alt text per locale.

### 4. [Low] favicon is good but no apple-touch-icon
- `/logo.svg` is set as favicon ✅
- No `apple-touch-icon` declared. iOS Safari will use the favicon at low quality.
- **Recommendation:** Add `/logo-180.png` (or use the SVG; iOS 18+ supports SVG) and declare `<link rel="apple-touch-icon" href="/logo-180.png">`.

### 5. [Low] No Open Graph image for `summary` (smaller) card
- Only `summary_large_image` (1600×686) is configured. Some platforms (Slack, Discord) prefer square or smaller images.
- **Recommendation:** Add a 1200×630 variant specifically for OG (different aspect ratio) or accept the current 1600×686 — most platforms will downscale.

### 6. [Info] No image sitemap entry
- `sitemap.xml` only lists HTML pages, not the hero image. Google Images can still find the image via OG tags, but a dedicated `image:image` element in sitemap would help:
  ```xml
  <image:image>
    <image:loc>https://compresspic.top/assets/frog-hero-bg-1600.webp</image:loc>
    <image:caption>Frog Compress - Local Image Compression Tool</image:caption>
    <image:title>Frog Compress Hero</image:title>
  </image:image>
  ```

## Format Recommendations

| Current | Recommended | Reason |
|---|---|---|
| WebP | WebP or AVIF | WebP is widely supported (97%+ browsers). AVIF is 20% smaller but only 95% support — only worth the extra conversion if you already have a build step. |
| SVG (favicon) | Keep SVG | Modern browsers support SVG favicons. ✅ |
| Background images in CSS | OK as is | CSS-set images don't need alt, but if the hero is meaningful, prefer an `<img>` tag for accessibility. |