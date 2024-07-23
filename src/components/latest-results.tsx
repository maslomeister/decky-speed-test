import { Field, PanelSectionRow } from "decky-frontend-lib";
import { TbWorldUpload, TbWorldDownload } from "react-icons/tb";
import { LatestResult } from "../app/backend";
import { HorizontalContainer } from "./horizontal-container";
import { useMemo } from "react";
import { compareDateToNow } from "../utils";

type Props = {
  results: LatestResult;
};

export const LatestResults = ({ results }: Props) => {
  const date = useMemo(() => {
    return compareDateToNow(results.date_time);
  }, [results.date_time]);

  return (
    <>
      <div style={{ fontWeight: 600 }}>
        <PanelSectionRow>
          <Field
            label="LAST TEST"
            inlineWrap="keep-inline"
            bottomSeparator="thick"
          >
            <div style={{ fontWeight: 600 }}>{date}</div>
          </Field>
        </PanelSectionRow>
      </div>

      <PanelSectionRow>
        <Field label="WIFI" inlineWrap="keep-inline">
          <div style={{ fontWeight: 600 }}>{results.network_name}</div>
        </Field>
      </PanelSectionRow>

      <PanelSectionRow>
        <Field label="SPEED" inlineWrap="keep-inline">
          <HorizontalContainer style={{ gap: "4px", fontWeight: 600 }}>
            <HorizontalContainer style={{ gap: "4px" }}>
              <HorizontalContainer>
                <TbWorldDownload color="#f6821f" />
                <div>{results.down}</div>
              </HorizontalContainer>
              <HorizontalContainer>
                <TbWorldUpload color="#8d1eb1" />
                <div>{results.up}</div>
              </HorizontalContainer>
            </HorizontalContainer>
            <div style={{ fontSize: "12px" }}>Mbps</div>
          </HorizontalContainer>
        </Field>
      </PanelSectionRow>

      <PanelSectionRow>
        <Field label="PING" inlineWrap="keep-inline">
          <div style={{ fontWeight: 600 }}>{results.latency} ms</div>
        </Field>
      </PanelSectionRow>

      <PanelSectionRow>
        <Field label="JITTER" inlineWrap="keep-inline">
          <div style={{ fontWeight: 600 }}>{results.jitter} ms</div>
        </Field>
      </PanelSectionRow>
    </>
  );
};
