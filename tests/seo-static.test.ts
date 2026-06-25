import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";

const root = process.cwd();
const siteUrl = "https://compresspic.top/";

test("index.html includes core SEO metadata for the production domain", () => {
  const html = readFileSync(join(root, "index.html"), "utf8");

  expect(html).toContain(`<link rel="canonical" href="${siteUrl}" />`);
  expect(html).toContain('property="og:title"');
  expect(html).toContain('property="og:description"');
  expect(html).toContain('property="og:url"');
  expect(html).toContain('name="twitter:card"');
  expect(html).toContain('application/ld+json');
});

test("robots and sitemap expose the production homepage", () => {
  const robots = readFileSync(join(root, "public", "robots.txt"), "utf8");
  const sitemap = readFileSync(join(root, "public", "sitemap.xml"), "utf8");

  expect(robots).toContain("User-agent: *");
  expect(robots).toContain(`Sitemap: ${siteUrl}sitemap.xml`);
  expect(sitemap).toContain(`<loc>${siteUrl}</loc>`);
  expect(sitemap).toContain(`<loc>${siteUrl}compressor/</loc>`);
  expect(sitemap).toContain(`<loc>${siteUrl}image-compressor/</loc>`);
  expect(sitemap).toContain(`<loc>${siteUrl}jpg-size-reducer/</loc>`);
  expect(sitemap).toContain(`<loc>${siteUrl}tiny-png-alternative/</loc>`);
  expect(sitemap).toContain(`<loc>${siteUrl}compressor-io-alternative/</loc>`);
});
