import { VFC, useEffect, useState } from "react";
import { Backend } from "../app/backend";
import { Spinner } from "decky-frontend-lib";
import { ResultsList } from "../components/all-results/results-list";

export type AIM = {
  name: string;
  points: number;
  classificationIdx: 0 | 1 | 2 | 3 | 4;
  classificationName: "bad" | "poor" | "average" | "good" | "great";
};

export type Data = {
  date_time: string;
  down: number;
  up: number;
  latency: number;
  jitter: number;
  network_name: string;
  aim_scores: AIM[];
};

export type DataProps = {
  data: Data[];
  has_more: boolean;
};

type Props = {
  backend: Backend;
};

export const AllTests: VFC<Props> = ({ backend }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<Data[] | undefined>(undefined);
  const [hasMoreToFetch, setHasMoreToFetch] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await backend.serverAPI.callPluginMethod<
        { start_index: number; amount: number },
        DataProps
      >("fetch_paginated_results", { start_index: 0, amount: 10 });

      if (data.result !== null && data.success) {
        setData(data.result.data);
        setHasMoreToFetch(data.result.has_more);
        setLoading(false);
      }
    };

    // call the function
    fetchData()
      // make sure to catch any error
      .catch(console.error);
  }, []);

  if (loading || data === undefined)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Spinner style={{ maxWidth: "32px", maxHeight: "32px" }} />
      </div>
    );

  if (data.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        No tests to load
      </div>
    );
  }

  return (
    <ResultsList
      incoming_data={data}
      hasMoreToFetch={hasMoreToFetch}
      backend={backend}
    />
  );
};
