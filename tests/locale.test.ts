import { expect, test } from "vitest";
import enUS from "@/locales/en-US";
import esES from "@/locales/es-ES";
import faIR from "@/locales/fa-IR";
import frFR from "@/locales/fr-FR";
import jaJP from "@/locales/ja-JP";
import koKR from "@/locales/ko-KR";
import trTR from "@/locales/tr-TR";
import zhCN from "@/locales/zh-CN";
import zhTW from "@/locales/zh-TW";

const locales = [enUS, esES, faIR, frFR, jaJP, koKR, trTR, zhCN, zhTW];
const localizedBrands = new Set([
  "Frog Compress",
  "Frog Compresor",
  "فشرده‌ساز قورباغه",
  "Frog Compression",
  "Frog圧縮",
  "개구리 압축",
  "Frog Sıkıştırma",
  "青蛙压缩",
  "青蛙壓縮",
]);

test("all locales provide flat SEO home content", () => {
  for (const locale of locales) {
    expect(locale.homeContent.meta.title.length).toBeGreaterThan(0);
    expect(locale.homeContent.meta.description.length).toBeGreaterThan(0);
    expect(locale.homeContent.intro.title.length).toBeGreaterThan(0);
    expect(locale.homeContent.intro.description.length).toBeGreaterThan(0);
    expect(locale.homeContent.features).toHaveLength(4);
    expect(locale.homeContent.steps).toHaveLength(3);
    expect(locale.homeContent.faqs).toHaveLength(3);

    for (const feature of locale.homeContent.features) {
      expect(feature.title.length).toBeGreaterThan(0);
      expect(feature.description.length).toBeGreaterThan(0);
    }

    for (const faq of locale.homeContent.faqs) {
      expect(faq.question.length).toBeGreaterThan(0);
      expect(faq.answer.length).toBeGreaterThan(0);
    }
  }
});

test("all locales use the frog compression brand", () => {
  for (const locale of locales) {
    const serialized = JSON.stringify(locale);

    expect(localizedBrands.has(locale.logo)).toBe(true);
    expect(serialized).not.toContain("Pic Smaller");
    expect(serialized).not.toContain("圖小小");
    expect(serialized).not.toContain("پیک کوچولو");
  }
});
