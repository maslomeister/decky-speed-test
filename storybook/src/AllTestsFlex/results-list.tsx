import { useState } from "react";
import { ResultRow } from "./result-row";

export type AIM = {
  name: string;
  points: number;
  classificationIdx: 0 | 1 | 2 | 3 | 4;
  classificationName: "bad" | "poor" | "average" | "good" | "great";
};

export type TestResult = {
  date_time: string;
  down: number;
  up: number;
  latency: number;
  jitter: number;
  network_name: string;
  aim_scores: AIM[];
};

type ResultListProps = {
  incoming_data: TestResult[];
};

export const ResultsList = ({ incoming_data }: ResultListProps) => {
  const [data, _setData] = useState(() => [...incoming_data]);

  return (
    <div style={{ width: "100%" }}>
      {data.map((item) => (
        <ResultRow incoming_data={item} />
      ))}
    </div>
  );
};
