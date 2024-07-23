import { definePlugin, ServerAPI, staticClasses } from "decky-frontend-lib";
import { SiSpeedtest } from "react-icons/si";
import { Main } from "./pages/main";
import SpeedTestEngine from "@cloudflare/speedtest";

import { Backend } from "./app/backend";

// const DeckyPluginRouterTest: VFC = () => {
//   return (
//     <div style={{ marginTop: "50px", color: "white" }}
//       Hello World!
//       <DialogButton onClick={() => Navigation.NavigateToLibraryTab()}>
//         Go to Library
//       </DialogButton>
//     </div>
//   );
// };

export default definePlugin((serverAPI: ServerAPI) => {
  const engine = new SpeedTestEngine({ autoStart: false });
  const backend = new Backend(engine, serverAPI);

  backend.saveResultsOnFinish(() => {
    serverAPI.toaster.toast({
      body: <div>Results saved</div>,
      title: "Speed Test: completed",
      icon: <SiSpeedtest />,
      duration: 4 * 1000,
      critical: false,
    });
  });

  // serverApi.routerHook.addRoute("/decky-speed-test", DeckyPluginRouterTest, {
  //   exact: true,
  // });

  return {
    title: <div className={staticClasses.Title}>Speed Test</div>,
    content: <Main backend={backend} />,
    icon: <SiSpeedtest />,
    onDismount() {
      serverAPI.routerHook.removeRoute("/decky-speed-test");
    },
  };
});
