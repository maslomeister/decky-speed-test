import { PanelSection, Spinner } from "decky-frontend-lib";
import { Stats } from "../components/stats";
import { VFC, useEffect, useState } from "react";
import { Backend, LatestResultFetch } from "../app/backend";

type Props = {
  backend: Backend;
};

export const Main: VFC<Props> = ({ backend }: Props) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await backend.serverAPI.callPluginMethod<
        [],
        LatestResultFetch
      >("fetch_latest_result", {});

      if (data.result !== null && typeof data.result === "object") {
        backend.SetLatestResult(data.result);
        setLoading(false);
      }
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "128px",
        }}
      >
        <Spinner style={{ maxWidth: "32px", maxHeight: "32px" }} />
      </div>
    );

  return (
    <>
      <PanelSection>
        <Stats backend={backend} />
      </PanelSection>

      {/* <PanelSection title="MISC">
        <PanelSectionRow>
          <ButtonItem layout="below">PREVIOUS TESTS</ButtonItem>
        </PanelSectionRow>

        <PanelSectionRow>
          <ButtonItem layout="below">SETTINGS</ButtonItem>
        </PanelSectionRow>
      </PanelSection> */}
    </>
  );
};
