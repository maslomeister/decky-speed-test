import { CiCalendarDate } from "react-icons/ci";

import { FaForumbee } from "react-icons/fa";
import { FaArrowsAltV } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";
import { HorizontalContainer } from "../horizontal-container";
import {
  convertMbpsToMBs,
  formatDate,
  formatNames,
  getColor,
} from "../../utils";
import { date_container, main_container, number_container } from "./styles";
import { VerticalContainer } from "../vertical-container";

import { FocusableExt } from "../focusable-ext";
import { AIM, Data } from "../../containers/all-tests";
import { useLocator } from "../locator";

type ResultListProps = {
  incoming_data: Data;
};

function formatScores(aim_scores: AIM[]) {
  return (
    <>
      {aim_scores.map((item) => (
        <HorizontalContainer style={{ justifyContent: "start", gap: "8px" }}>
          {formatNames(item.name)}{" "}
          <div
            style={{ color: getColor(item.classificationIdx), fontWeight: 600 }}
          >
            {item.classificationName.toLocaleUpperCase()}
          </div>
        </HorizontalContainer>
      ))}
    </>
  );
}

export const ResultRow = ({ incoming_data }: ResultListProps) => {
  const { currentSettings: settings } = useLocator();

  return (
    <FocusableExt>
      <div style={main_container}>
        <HorizontalContainer
          style={{ gap: "16px", justifyContent: "space-around" }}
        >
          <VerticalContainer>
            <HorizontalContainer
              style={{ justifyContent: "start", gap: "4px" }}
            >
              <FaDownload style={{ fontSize: "14px" }} />
              <div>Download</div>
            </HorizontalContainer>
            <HorizontalContainer
              style={{
                width: "100%",
                alignItems: "baseline",
                gap: "4px",
                color: "#fbc699",
              }}
            >
              <div
                style={{
                  ...number_container,
                  paddingLeft: "48px",
                }}
              >
                {settings.bitsPerSecond
                  ? incoming_data.down
                  : convertMbpsToMBs(incoming_data.down)}
              </div>
              <div>{settings.bitsPerSecond ? "Mbps" : "MBs"}</div>
            </HorizontalContainer>
          </VerticalContainer>
          <VerticalContainer>
            <HorizontalContainer
              style={{ justifyContent: "start", gap: "4px" }}
            >
              <FaUpload style={{ fontSize: "14px" }} />
              <div>Upload</div>
            </HorizontalContainer>
            <HorizontalContainer
              style={{ width: "100%", alignItems: "baseline", gap: "4px" }}
            >
              <div
                style={{
                  ...number_container,
                  color: "#cb99dc",
                  paddingLeft: "48px",
                }}
              >
                {settings.bitsPerSecond
                  ? incoming_data.up
                  : convertMbpsToMBs(incoming_data.up)}
              </div>
              <div>{settings.bitsPerSecond ? "Mbps" : "MBs"}</div>
            </HorizontalContainer>
          </VerticalContainer>
          <VerticalContainer>
            <HorizontalContainer
              style={{ justifyContent: "start", gap: "4px" }}
            >
              <FaArrowsAltV style={{ fontSize: "14px" }} />
              <div>Ping</div>
            </HorizontalContainer>
            <HorizontalContainer
              style={{ width: "100%", alignItems: "baseline", gap: "4px" }}
            >
              <div style={{ ...number_container, paddingLeft: "24px" }}>
                {incoming_data.latency}
              </div>
              ms
            </HorizontalContainer>
          </VerticalContainer>
          <VerticalContainer>
            <HorizontalContainer
              style={{ justifyContent: "start", gap: "4px" }}
            >
              <FaForumbee style={{ fontSize: "14px" }} />
              <div>Jitter</div>
            </HorizontalContainer>
            <HorizontalContainer
              style={{ width: "100%", alignItems: "baseline", gap: "4px" }}
            >
              <div style={{ ...number_container, paddingLeft: "24px" }}>
                {incoming_data.jitter}
              </div>
              ms
            </HorizontalContainer>
          </VerticalContainer>
        </HorizontalContainer>

        <HorizontalContainer style={{ gap: "24px", justifyContent: "center" }}>
          {formatScores(incoming_data.aim_scores)}
        </HorizontalContainer>

        <HorizontalContainer>
          <HorizontalContainer style={{ gap: "8px", justifyContent: "start" }}>
            <b>Network</b> {incoming_data.network_name}
          </HorizontalContainer>

          <div style={date_container}>
            <CiCalendarDate />
            {formatDate(incoming_data.date_time)}
          </div>
        </HorizontalContainer>
      </div>
    </FocusableExt>
  );
};
