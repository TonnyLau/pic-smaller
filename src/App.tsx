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

export const App = observer(() => {
  useMobileVConsole();

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
