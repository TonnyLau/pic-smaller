# On-Page SEO Findings — compresspic.top

## Title Tags

| Locale | Title | Length | Issue |
|---|---|---|---|
| zh-CN (default) | 青蛙压缩 - 本地图片压缩工具 | 13 chars | ✅ keyword-front-loaded |
| en-US | Frog Compress - Local Image Compression Tool | 42 chars | ✅ |
| zh-TW | 青蛙壓縮 - 本地圖片壓縮工具 | 13 chars | ✅ |
| ja-JP | Frog圧縮 - ローカル画像圧縮ツール | 18 chars | ✅ |
| ko-KR | 개구리 압축 - 로컬 이미지 압축 도구 | 17 chars | ✅ |
| fr-FR | Frog Compression - Outil Local de Compression d'Images | 50 chars | ✅ |
| es-ES | Frog Compresor - Herramienta Local de Compresión de Imágenes | 56 chars | ✅ |
| tr-TR | Frog Sıkıştırma - Yerel Görsel Sıkıştırma Aracı | 44 chars | ✅ |
| fa-IR | فشرده‌ساز قورباغه - ابزار فشرده‌سازی محلی تصاویر | 35 chars (RTL) | ✅ |

**Pattern:** `Brand - Product descriptor` — clean, consistent across all locales. ✅

## Meta Descriptions

| Locale | Description | Length | Status |
|---|---|---|---|
| zh-CN | 青蛙压缩是一款本地图片压缩工具，图片不上传服务器，一键瘦身，尽量保持清晰，保护隐私不泄露。 | **45 chars** | ⚠️ Too short — Google displays 90–155 chars typically |
| en-US | Frog Compress compresses images in your browser. Images are not uploaded, privacy stays local, and files get smaller while staying clear for everyday use. | 154 chars | ✅ |
| zh-TW | 青蛙壓縮在瀏覽器本機壓縮圖片，圖片不會上傳伺服器，一鍵瘦身，盡量保持清晰，也保護隱私。 | **43 chars** | ⚠️ Too short |
| ja-JP | Frog圧縮 はブラウザ内で画像を圧縮します。… | 74 chars | ⚠️ Slightly short |
| ko-KR | 개구리 압축는 브라우저에서 이미지를 압축합니다. … | 91 chars | ✅ |
| fr-FR | Frog Compression compresse les images dans votre navigateur. Les images ne sont pas téléversées, la confidentialité reste locale et les fichiers deviennent plus légers. | 168 chars | ✅ |
| es-ES | Frog Compresor comprime imágenes en el navegador. Las imágenes no se suben, la privacidad queda en tu dispositivo y los archivos se reducen manteniendo buena claridad. | 167 chars | ✅ |
| tr-TR | Frog Sıkıştırma görselleri tarayıcınızda sıkıştırır. Görseller yüklenmez, gizlilik cihazınızda kalır ve dosyalar günlük kullanım için net kalacak şekilde küçülür. | 162 chars | ✅ |
| fa-IR | فشرده‌ساز قورباغه تصاویر را در مرورگر فشرده می‌کند. تصاویر آپلود نمی‌شوند، حریم خصوصی روی دستگاه شما می‌ماند و فایل‌ها با وضوح مناسب کوچک‌تر می‌شوند. | 149 chars | ✅ |

**Recommendation:** Expand zh-CN, zh-TW, and ja-JP descriptions to 90–155 character equivalents (CJK: ~80–120 characters). Add: supported formats, free, batch, browser support, key use cases.

## Heading Structure

The prerendered HTML has **zero H1/H2/H3 tags in the body** — the body is just `<div id="root"></div>`. Headings are inserted by React after JS execution. **The static HTML doesn't expose headings to crawlers that don't run JS.**

**Recommendation:** Augment the prerender to inline at least:
- `<h1>` with the product hero title (localized)
- `<h2>` for the main feature sections (localized)
- `<h3>` for individual features within a section

## Canonical Tags

- Each page declares a self-referencing canonical ✅
- BUT: canonicals use `https://compresspic.top/...` (no www), while the server responds at `https://www.compresspic.top/...`. See `technical.md` finding #1.

## Hreflang

| Locale | hreflang | URL | Match self? |
|---|---|---|---|
| zh-CN | zh-CN | `https://compresspic.top/` | ✅ |
| en-US | en-US | `https://compresspic.top/en-US/` | ✅ |
| zh-TW | zh-TW | `https://compresspic.top/zh-TW/` | ✅ |
| ja-JP | ja-JP | `https://compresspic.top/ja-JP/` | ✅ |
| ko-KR | ko-KR | `https://compresspic.top/ko-KR/` | ✅ |
| fr-FR | fr-FR | `https://compresspic.top/fr-FR/` | ✅ |
| es-ES | es-ES | `https://compresspic.top/es-ES/` | ✅ |
| tr-TR | tr-TR | `https://compresspic.top/tr-TR/` | ✅ |
| fa-IR | fa-IR | `https://compresspic.top/fa-IR/` | ✅ |
| x-default | — | `https://compresspic.top/` | ✅ |

- All 9 locales declared ✅
- `x-default` correctly set to the default (zh-CN) ✅
- All hreflang URLs use non-www + trailing-slash, same issue as canonicals

**Concern:** Use of zh-CN as x-default means English-speaking searchers who land on the homepage see Chinese content. If you want English-first global discoverability, set x-default to `https://compresspic.top/en-US/`.

## Open Graph & Twitter Card

- ✅ `og:type`, `og:site_name`, `og:url`, `og:title`, `og:description`, `og:image` (with width/height/type/alt) — comprehensive.
- ✅ `twitter:card=summary_large_image`, all Twitter tags present.
- ⚠️ `og:url` uses non-www + trailing slash, same as canonical (consistent within the site's choice, even if not matching the actual served URL).

## Internal Linking

The static HTML has **zero internal links** because all navigation is rendered client-side. This means:
- No link equity flows within the site (not an issue for a single-page tool, but means no cross-locale link signals either)
- The `<link rel="alternate" hreflang>` tags are the only intra-site linkage Google sees from the HTML
- A user (or crawler) without JS sees only the homepage with no way to navigate to other locales

**Recommendation:** Add a language picker at the bottom of each prerendered body so users without JS can switch locales. Also adds internal linking for crawlers.

## Image Alt Text

- Hero image has `og:image:alt="青蛙压缩 - 本地图片压缩工具"` ✅
- Need to verify the rendered DOM has proper `alt` attributes on all user-facing images (compress UI thumbnails, file icons, etc.). Cannot verify without JS rendering.

## Page-level keyword targeting

| Locale | Primary keyword | In title | In description | In JSON-LD name |
|---|---|---|---|---|
| zh-CN | 图片压缩 / 本地图片压缩 | ✅ | ✅ | ✅ |
| en-US | local image compression | ✅ | ✅ | ✅ |
| zh-TW | 圖片壓縮 | ✅ | ✅ | ✅ |
| ja-JP | 画像圧縮 | ✅ | ✅ | ✅ |
| ko-KR | 이미지 압축 | ✅ | ✅ | ✅ |
| fr-FR | compression d'images | ✅ | ✅ | ✅ |
| es-ES | compresión de imágenes | ✅ | ✅ | ✅ |
| tr-TR | görsel sıkıştırma | ✅ | ✅ | ✅ |
| fa-IR | فشرده‌سازی تصاویر | ✅ | ✅ | ✅ |

**Status:** All locales have proper keyword targeting on title/description/name. ✅