import { ButtonItem, PanelSection, PanelSectionRow } from "decky-frontend-lib";
import { Stats } from "../components/stats";
import SpeedTestEngine from "@cloudflare/speedtest";

type Props = {
  engine: SpeedTestEngine;
};

export const Main = ({ engine }: Props) => {
  return (
    <>
      <PanelSection>
        <Stats engine={engine} />

        <PanelSectionRow>
          <ButtonItem layout="below">PREVIOUS TESTS</ButtonItem>
        </PanelSectionRow>

        <PanelSectionRow>
          <ButtonItem layout="below">SETTINGS</ButtonItem>
        </PanelSectionRow>
      </PanelSection>
    </>
  );
};
