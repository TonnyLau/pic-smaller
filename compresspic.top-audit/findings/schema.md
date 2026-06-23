# Schema & Structured Data Findings — compresspic.top

**JSON-LD type count:** 3 entities per locale (WebSite, SoftwareApplication, FAQPage)
**Validation:** All blocks parse as valid JSON ✅

## Current Implementation

Each locale's `<head>` contains a single `<script type="application/ld+json">` with an `@graph` of three entities:

| Entity | Fields present | Fields missing |
|---|---|---|
| **WebSite** | `@id`, `url`, `name`, `inLanguage` | `potentialAction` (SearchAction), `publisher`, `sameAs` |
| **SoftwareApplication** | `@id`, `name`, `applicationCategory`, `operatingSystem`, `url`, `description`, `image`, `offers` | `aggregateRating`, `author`, `datePublished`, `softwareVersion`, `fileSize`, `downloadUrl`, `screenshot`, `featureList` |
| **FAQPage** | `@id`, `mainEntity` (3 Q&A) | More Q&A pairs would be richer |

## Issues

### 1. [High] SoftwareApplication lacks author, datePublished, softwareVersion
- **Impact:** Google uses `author` and `datePublished` for entity understanding. Without them, the app is harder to attribute and harder to rank as a software product.
- **Fix:** Add:
  ```json
  "author": {
    "@type": "Organization",
    "name": "joye61",
    "url": "https://github.com/joye61/pic-smaller"
  },
  "datePublished": "2024-01-01",
  "softwareVersion": "1.1.0",
  "featureList": [
    "Local image compression",
    "No server upload",
    "Multiple formats (PNG, JPEG, WebP, AVIF, GIF, SVG)",
    "Batch compression",
    "Browser-based, privacy-first"
  ]
  ```

### 2. [Medium] SoftwareApplication has no aggregateRating
- **Impact:** Apps with star ratings get rich snippets with stars in SERPs. Currently no review/rating data.
- **Fix:** Either collect ratings (a simple "How was this tool?" inline poll that maps to `aggregateRating`) or leave it out — do NOT fabricate ratings.

### 3. [Low] WebSite lacks SearchAction (sitelinks search box)
- **Impact:** Sites with on-site search can show a search box in SERPs.
- **Fix:** This is a single-purpose tool without internal search, so it's fine to skip. Skip.

### 4. [Low] No Organization schema on the homepage
- **Impact:** Google's Knowledge Graph needs an Organization entity to link this site to a brand.
- **Fix:** Add an `Organization` JSON-LD block (not in `@graph`, separate) linking to:
  - GitHub repo: `https://github.com/joye61/pic-smaller`
  - Author's social/contact: email or website (the README has `89065495@qq.com`)
  ```json
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "joye61",
    "url": "https://github.com/joye61/pic-smaller",
    "logo": "https://compresspic.top/logo.svg"
  }
  ```

### 5. [Low] Same canonical `@id` across all locales may dilute entity linking
- **Evidence:** Each locale declares the same `@id` for the SoftwareApplication: `https://compresspic.top/#app`. Same for FAQPage.
- **Impact:** Google may treat different locale versions as the same entity. This is usually desired, but combined with `inLanguage` differences it's redundant.
- **Fix:** Optionally append locale: `https://compresspic.top/en-US/#app`. Not critical.

### 6. [Info] FAQPage only has 3 questions
- **Impact:** With only 3 Q&A, this is a minimal FAQ. Google's "FAQ rich result" eligibility is now restricted — it shows FAQ rich results only for authoritative government/health sites (2023 policy update). For other sites, FAQ schema still helps with AI understanding, but won't show as rich snippets in SERPs.
- **Fix:** Expand FAQ to 6–10 Q&A covering common concerns. Even if not displayed as rich snippets, AI crawlers (ChatGPT, Perplexity) extract these heavily.

## Validation Summary

| Locale | Valid JSON | Types correct | Required fields | Recommendation |
|---|---|---|---|---|
| zh-CN | ✅ | ✅ | Partial | Add author, datePublished, softwareVersion |
| en-US | ✅ | ✅ | Partial | Same |
| zh-TW | ✅ | ✅ | Partial | Same |
| ja-JP | ✅ | ✅ | Partial | Same |
| ko-KR | ✅ | ✅ | Partial | Same |
| fr-FR | ✅ | ✅ | Partial | Same |
| es-ES | ✅ | ✅ | Partial | Same |
| tr-TR | ✅ | ✅ | Partial | Same |
| fa-IR | ✅ | ✅ | Partial | Same |

All 9 locales have identical schema structure with localized content — this is the right pattern. Just enrich it.