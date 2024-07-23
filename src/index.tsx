import { definePlugin, ServerAPI, staticClasses } from "decky-frontend-lib";
import { SiSpeedtest } from "react-icons/si";
import { Main } from "./pages/main";
import SpeedTestEngine from "@cloudflare/speedtest";

import { Backend } from "./app/backend";
// import { VFC } from "react";

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

  // const DeckyPluginRouterTest: VFC = () => {
  //   return (
  //     <div style={{ marginTop: "50px", color: "white" }}>
  //       Hello World!
  //       <DialogButton onClick={() => Navigation.NavigateToLibraryTab()}>
  //         Go to Library
  //       </DialogButton>
  //     </div>
  //   );
  // };

  // serverAPI.routerHook.addRoute(
  //   "/decky-speed-test/download",
  //   DeckyPluginRouterTest,
  //   {
  //     exact: true,
  //   }
  // );

  return {
    title: <div className={staticClasses.Title}>Speed Test</div>,
    content: <Main backend={backend} />,
    icon: <SiSpeedtest />,
    onDismount() {
      // serverAPI.routerHook.removeRoute("/decky-speed-test");
    },
  };
});
