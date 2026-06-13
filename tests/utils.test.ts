import { expect, test } from "vitest";
import {
  calculateSaving,
  getUniqNameOnNames,
  normalize,
  resolveSmartCompressOption,
} from "@/functions";

test("Path normalize check", () => {
  expect(normalize("")).toBe("");
  expect(normalize("/a/b")).toBe("a/b");
  expect(normalize("/sub/a/b", "/sub")).toBe("a/b");
  expect(normalize("/a/b", "/sub")).toBe("error404");
});

test("Rename check", () => {
  const names = new Set<string>(["a.jpg", "b.png"]);
  expect(getUniqNameOnNames(names, "a.jpg")).toBe("a(1).jpg");
  names.add("a(1).jpg");
  expect(getUniqNameOnNames(names, "a.jpg")).toBe("a(1)(1).jpg");
});

test("Smart compression keeps original format with balanced defaults", () => {
  expect(
    resolveSmartCompressOption("image/jpeg").format.target,
  ).toBeUndefined();
  expect(resolveSmartCompressOption("image/jpeg").jpeg.quality).toBe(0.75);
  expect(resolveSmartCompressOption("image/png").png).toEqual({
    colors: 128,
    dithering: 0.5,
  });
  expect(resolveSmartCompressOption("image/webp").jpeg.quality).toBe(0.75);
  expect(resolveSmartCompressOption("image/gif").gif).toEqual({
    colors: 128,
    dithering: false,
  });
  expect(
    resolveSmartCompressOption("image/svg+xml").format.target,
  ).toBeUndefined();
});

test("Calculate saving handles smaller output, larger output, and zero origin", () => {
  expect(calculateSaving(1000, 650)).toEqual({
    savedBytes: 350,
    savedPercent: 35,
  });
  expect(calculateSaving(1000, 1200)).toEqual({
    savedBytes: -200,
    savedPercent: -20,
  });
  expect(calculateSaving(0, 1200)).toEqual({
    savedBytes: -1200,
    savedPercent: 0,
  });
});
