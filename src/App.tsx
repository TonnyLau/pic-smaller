import { ConfigProvider, App as AntApp } from "antd";
import { observer } from "mobx-react-lite";
import { gstate } from "./global";
import { ContextAction } from "./ContextAction";
import { Analytics } from "@vercel/analytics/react";
import { Loading } from "./components/Loading";
import { useResponse } from "./media";
import { useEffect } from "react";

function useMobileVConsole() {
  const { isMobile } = useResponse();
  useEffect(() => {
    if (!isMobile || !import.meta.env.DEV) return;
    let vConsole: any = null;
    import("vconsole").then((result) => {
      vConsole = new result.default({ theme: "dark" });
    });
    return () => vConsole?.destroy();
  }, [isMobile]);
}

function useHtmlLangSync() {
  // Belt-and-braces: the router's applyLang already sets <html lang/dir>;
  // this effect re-asserts whenever gstate.lang changes (e.g. on first paint).
  useEffect(() => {
    document.documentElement.lang = gstate.lang ?? "zh-CN";
    document.documentElement.dir = gstate.lang === "fa-IR" ? "rtl" : "ltr";
  }, [gstate.lang]);
}

export const App = observer(() => {
  useMobileVConsole();
  useHtmlLangSync();

  return (
    <ConfigProvider
      locale={gstate.locale?.antLocale}
      theme={{
        token: {
          borderRadius: 6,
          colorPrimary: "#16a36d",
          colorLink: "#128559",
          colorSuccess: "#16a36d",
        },
      }}
    >
      <AntApp>
        <ContextAction />
      </AntApp>
      {import.meta.env.MODE === "production" && <Analytics />}
      {gstate.page}
      {gstate.loading && <Loading />}
    </ConfigProvider>
  );
});
