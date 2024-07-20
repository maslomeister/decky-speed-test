import { definePlugin, ServerAPI, staticClasses } from "decky-frontend-lib";
import { VFC } from "react";
import { SiSpeedtest } from "react-icons/si";
import { Main } from "./pages/main";
import SpeedTestEngine from "@cloudflare/speedtest";

const Content: VFC<{ serverAPI: ServerAPI; engine: SpeedTestEngine }> = ({
  serverAPI,
  engine,
}) => {
  // const [result, setResult] = useState<number | undefined>();

  // const onClick = async () => {
  //   const result = await serverAPI.callPluginMethod<AddMethodArgs, number>(
  //     "add",
  //     {
  //       left: 2,
  //       right: 2,
  //     }
  //   );
  //   if (result.success) {
  //     setResult(result.result);
  //   }
  // };

  return <Main engine={engine} />;
};

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

export default definePlugin((serverApi: ServerAPI) => {
  const engine = new SpeedTestEngine({ autoStart: false });
  // serverApi.routerHook.addRoute("/decky-speed-test", DeckyPluginRouterTest, {
  //   exact: true,
  // });

  return {
    title: <div className={staticClasses.Title}>Speed Test</div>,
    content: <Content serverAPI={serverApi} engine={engine} />,
    icon: <SiSpeedtest />,
    onDismount() {
      serverApi.routerHook.removeRoute("/decky-speed-test");
    },
  };
});
