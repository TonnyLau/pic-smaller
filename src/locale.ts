// https://www.techonthenet.com/js/language_tags.php
import { gstate } from "./global";
import { MenuProps } from "antd";
import { locales } from "./modules";

const localeCacheKey = "Pic-Smaller-Locale";
const defaultLang = "zh-CN";

export const langList: NonNullable<MenuProps["items"]> = [
  { key: "en-US", label: "English" },
  { key: "tr-TR", label: "Türkçe" },
  { key: "fr-FR", label: "Français" },
  { key: "es-ES", label: "Español" },
  { key: "ko-KR", label: "한국인" },
  { key: "ja-JP", label: "日本語" },
  { key: "zh-TW", label: "繁體中文" },
  { key: "zh-CN", label: "简体中文" },
  { key: "fa-IR", label: "فارسی" },
];

function getLang() {
  return window.localStorage.getItem(localeCacheKey) ?? defaultLang;
}

async function setLocaleData(lang: string) {
  let importer = locales[`/src/locales/${lang}.ts`];
  if (!importer) {
    importer = locales[`/src/locales/${defaultLang}.ts`];
  }
  gstate.locale = (await importer()).default;
}

export async function changeLang(lang: string) {
  gstate.lang = lang;
  window.localStorage.setItem(localeCacheKey, lang);
  await setLocaleData(lang);
}

export async function initLang() {
  gstate.lang = getLang();
  await setLocaleData(gstate.lang);
}
