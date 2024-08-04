import { AIM, TestResult } from "./results-list";
import { date_container, main_container, number_container } from "./styles";
import { CiCalendarDate } from "react-icons/ci";
import { HorizontalContainer } from "./horizontal-container";
import { getColor } from "../utils/utils";
import { VerticalContainer } from "./vertical-container";
import { FaForumbee } from "react-icons/fa";
import { FaArrowsAltV } from "react-icons/fa";
import { FaDownload } from "react-icons/fa";
import { FaUpload } from "react-icons/fa";

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const year = date.getFullYear().toString().slice(2); // YY
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // MM
  const day = date.getDate().toString().padStart(2, "0"); // DD
  const hours = date.getHours().toString().padStart(2, "0"); // HH
  const minutes = date.getMinutes().toString().padStart(2, "0"); // MM

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function formatNames(name: string) {
  switch (name.toLocaleUpperCase()) {
    case "STREAMING":
      return "VIDEO STREAMING";
    case "GAMING":
      return "ONLINE GAMING";
    case "RTC":
      return "VOICE CHATTING";
  }
}

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

type ResultListProps = {
  incoming_data: TestResult;
};

export const ResultRow = ({ incoming_data }: ResultListProps) => {
  return (
    <div style={main_container}>
      <HorizontalContainer
        style={{ gap: "16px", justifyContent: "space-around" }}
      >
        <VerticalContainer>
          <HorizontalContainer style={{ justifyContent: "start", gap: "4px" }}>
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
              {incoming_data.down}
            </div>
            Mbps
          </HorizontalContainer>
        </VerticalContainer>
        <VerticalContainer>
          <HorizontalContainer style={{ justifyContent: "start", gap: "4px" }}>
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
              {incoming_data.up}
            </div>
            <div>Mbps</div>
          </HorizontalContainer>
        </VerticalContainer>
        <VerticalContainer>
          <HorizontalContainer style={{ justifyContent: "start", gap: "4px" }}>
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
          <HorizontalContainer style={{ justifyContent: "start", gap: "4px" }}>
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

      <HorizontalContainer style={{ fontSize: "18px" }}>
        <HorizontalContainer style={{ gap: "8px", justifyContent: "start" }}>
          <b>Network</b> {incoming_data.network_name}
        </HorizontalContainer>
        <HorizontalContainer style={{ gap: "24px", justifyContent: "center" }}>
          {formatScores(incoming_data.aim_scores)}
        </HorizontalContainer>
        <div style={date_container}>
          <CiCalendarDate />
          {formatDate(incoming_data.date_time)}
        </div>
      </HorizontalContainer>
    </div>
  );
};
