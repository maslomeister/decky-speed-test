import { definePlugin, ServerAPI, staticClasses } from "decky-frontend-lib";
import { SiSpeedtest } from "react-icons/si";
import { Main } from "./pages/main";
import SpeedTestEngine from "@cloudflare/speedtest";

import { Backend } from "./app/backend";
import { Settings } from "./app/settings";
import { LocatorProvider } from "./components/locator";
import { SETTINGS_ROUTE } from "./pages/navigation";
import { SettingsPage } from "./pages/settings";

export default definePlugin((serverAPI: ServerAPI) => {
  const engine = new SpeedTestEngine({ autoStart: false });
  const backend = new Backend(engine, serverAPI);
  const settings = new Settings();

  backend.saveResultsOnFinish(
    () => {
      serverAPI.toaster.toast({
        body: <div>Results saved</div>,
        title: "Speed Test: Completed",
        icon: <SiSpeedtest />,
        duration: 6 * 1000,
        critical: false,
      });
    },
    () => {
      serverAPI.toaster.toast({
        body: <div>Failed to complete, restart Steam</div>,
        title: "Speed Test: Failed",
        icon: <SiSpeedtest />,
        duration: 8 * 1000,
        critical: false,
      });
    }
  );

  serverAPI.routerHook.addRoute(SETTINGS_ROUTE, () => (
    <LocatorProvider settings={settings}>
      <SettingsPage />
    </LocatorProvider>
  ));

  return {
    title: <div className={staticClasses.Title}>Speed Test</div>,
    content: (
      <LocatorProvider settings={settings}>
        <Main backend={backend} />
      </LocatorProvider>
    ),
    icon: <SiSpeedtest />,
    onDismount() {
      serverAPI.routerHook.removeRoute(SETTINGS_ROUTE);
    },
  };
});
