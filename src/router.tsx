import { createBrowserHistory, Location } from "history";
import { gstate } from "./global";
import { modules } from "./modules";
import {
  applyLang,
  defaultLang,
  parseLocaleFromPath,
  supportedLangs,
} from "./locale";
import { getSeoPageSlug } from "./seoPages";

export const history = createBrowserHistory();

type Params = Record<string, string | number> | null;

export function goto(
  pathname: string = "/",
  params?: Params,
  type: string = "push",
) {
  pathname += buildQueryString(params);
  navigate(pathname, type);
}

function buildQueryString(params?: Params) {
  if (!params) return "";
  const search = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    search.append(key, String(value));
  });

  const query = search.toString();
  return query ? `?${query}` : "";
}

function navigate(pathname: string, type: string): void {
  if (type === "push") {
    history.push(pathname);
  } else if (type === "replace") {
    history.replace(pathname);
  } else {
    throw new Error("Error history route method");
  }
}

export function initRouter() {
  history.listen(({ location }) => {
    void handleRouteChange(location);
  });
  void handleRouteChange(history.location as Location);
}

async function handleRouteChange(location: Location) {
  const { lang, rest } = parseLocaleFromPath(location.pathname);
  const firstSeg = location.pathname.split("/").filter(Boolean)[0] ?? "";
  const topicSlug = getSeoPageSlug(rest);
  const localeIsValid =
    firstSeg === "" || supportedLangs.includes(firstSeg) || !!topicSlug;

  // Unknown prefix like "/xx/" — render error404.
  if (!localeIsValid) {
    const lang = defaultLang;
    await applyLang(lang);
    gstate.pathname = "error404";
    gstate.page = await loadPageComponent("error404");
    return;
  }

  const langToApply = lang ?? defaultLang;
  await applyLang(langToApply);

  // Only the home page exists today; anything past the locale prefix → 404.
  if (rest !== "/" && !topicSlug) {
    gstate.pathname = "error404";
    gstate.page = await loadPageComponent("error404");
    return;
  }

  gstate.pathname = topicSlug ?? "home";
  try {
    gstate.page = await loadPageComponent("home");
  } catch {
    gstate.page = await loadPageComponent("error404");
  }
}

async function loadPageComponent(pathname: string) {
  const importer = modules[`/src/pages/${pathname}/index.tsx`]();
  const result = await importer;
  return <result.default />;
}
