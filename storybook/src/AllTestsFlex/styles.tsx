import { CSSProperties } from "react";

export const main_container: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "24px",
  padding: "16px",
  borderBottom: "1px solid #868686",
};

export const data_container: CSSProperties = {
  display: "flex",
  flex: 1,
  gap: "2px",
  alignItems: "center",
};

export const speed_container: CSSProperties = {
  display: "flex",
  gap: "2px",
  alignItems: "center",
};

export const network_container: CSSProperties = {
  display: "flex",
  width: "100%",
  alignItems: "center",
  gap: "2px",
};

export const date_container: CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  gap: "2px",
  fontWeight: 600,
};

export const number_container: CSSProperties = {
  fontSize: "24px",
  fontWeight: 600,
  paddingLeft: "24px",
};
