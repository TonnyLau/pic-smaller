// https://www.techonthenet.com/js/language_tags.php
import { gstate } from "./global";
import { MenuProps } from "antd";
import { locales } from "./modules";
import { history } from "./router";

const localeCacheKey = "Pic-Smaller-Locale";
export const defaultLang = "zh-CN";

export const langList: NonNullable<MenuProps["items"]> = [
  { key: "en-US", label: "English" },
  { key: "zh-CN", label: "简体中文" },
  { key: "zh-TW", label: "繁體中文" },
  { key: "ja-JP", label: "日本語" },
  { key: "ko-KR", label: "한국어" },
  { key: "fr-FR", label: "Français" },
  { key: "es-ES", label: "Español" },
  { key: "tr-TR", label: "Türkçe" },
  { key: "fa-IR", label: "فارسی" },
];

export const supportedLangs: string[] = langList
  .map((i) => (i && "key" in i ? String(i.key) : null))
  .filter((x): x is string => !!x);

// Parse a pathname like "/en-US/foo" → { lang: "en-US", rest: "/foo" }.
// "/" → { lang: null, rest: "/" }. "/xx/" → { lang: null, rest: "/xx/" }.
export function parseLocaleFromPath(pathname: string): {
  lang: string | null;
  rest: string;
} {
  const trimmed = pathname.replace(/\/+$/, "") || "/";
  const segments = trimmed.split("/").filter(Boolean);
  const first = segments[0] ?? "";
  if (first && supportedLangs.includes(first)) {
    const rest = "/" + segments.slice(1).join("/");
    return { lang: first, rest: rest === "/" ? "/" : rest };
  }
  return { lang: null, rest: pathname };
}

export function localePath(lang: string): string {
  return lang === defaultLang ? "/" : `/${lang}/`;
}

async function setLocaleData(lang: string) {
  let importer = locales[`/src/locales/${lang}.ts`];
  if (!importer) {
    importer = locales[`/src/locales/${defaultLang}.ts`];
  }
  gstate.locale = (await importer()).default;
}

// Sets gstate.lang, syncs <html lang>/dir, writes localStorage, loads locale strings.
// Called by the router on every URL change.
export async function applyLang(lang: string): Promise<void> {
  gstate.lang = lang;
  if (typeof document !== "undefined") {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "fa-IR" ? "rtl" : "ltr";
  }
  try {
    window.localStorage.setItem(localeCacheKey, lang);
  } catch {
    /* localStorage may be unavailable (e.g. private mode) — ignore. */
  }
  await setLocaleData(lang);
}

// Used by the language-switcher menu. Pushes a new URL; the router listener
// will then call applyLang with the new locale.
export function changeLang(lang: string): void {
  history.push(localePath(lang));
}

// Called once on app boot. Reads locale from the current URL (falls back to
// the default locale when no prefix is present).
export async function initLang(): Promise<void> {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/";
  const { lang } = parseLocaleFromPath(pathname);
  await applyLang(lang ?? defaultLang);
}