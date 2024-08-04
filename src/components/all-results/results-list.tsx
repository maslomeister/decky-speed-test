import { useEffect, useRef, useState } from "react";
import { ResultRow } from "./result-row";
import { Data, DataProps } from "../../containers/all-tests";
import { Backend } from "../../app/backend";
import { HorizontalContainer } from "../horizontal-container";
import { Spinner } from "decky-frontend-lib";

type ResultListProps = {
  incoming_data: Data[];
  hasMoreToFetch: boolean;
  backend: Backend;
};

export const ResultsList = ({
  incoming_data,
  hasMoreToFetch,
  backend,
}: ResultListProps) => {
  const [index, setIndex] = useState(incoming_data.length);
  const [data, setData] = useState<Data[]>(incoming_data);
  const [moreToFetch, setMoreToFetch] = useState(hasMoreToFetch);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const observerTarget = useRef(null);

  const fetchMore = async () => {
    setLoading(true);

    const data = await backend.serverAPI.callPluginMethod<
      { start_index: number; amount: number },
      DataProps
    >("fetch_paginated_results", { start_index: index, amount: 10 });

    if (data.result !== null && data.success) {
      setData((prevData) => [...prevData, ...data.result.data]);
      setIndex((prev) => prev + data.result.data.length);
      setMoreToFetch(data.result.has_more);
      console.log(moreToFetch);
    }

    if (!data.success) {
      setError("Failed to load tests");
    }

    setLoading(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && moreToFetch && !loading) {
          fetchMore();
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [observerTarget, moreToFetch, loading]);

  return (
    <div style={{ width: "100%" }}>
      {data.map((item) => (
        <ResultRow incoming_data={item} />
      ))}
      {loading && (
        <HorizontalContainer style={{ justifyContent: "center" }}>
          <Spinner style={{ maxWidth: "32px", maxHeight: "32px" }} /> Loading
          older tests
        </HorizontalContainer>
      )}
      {error && (
        <HorizontalContainer style={{ justifyContent: "center" }}>
          {error}
        </HorizontalContainer>
      )}
      {!moreToFetch && (
        <HorizontalContainer
          style={{
            justifyContent: "center",
            paddingBottom: "16px",
            paddingTop: "16px",
          }}
        >
          No older tests found
        </HorizontalContainer>
      )}
      <div ref={observerTarget}></div>
    </div>
  );
};
