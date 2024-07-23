import { useEffect, useState } from "react";
import { BandwidthPoint, Graph } from "./graph";
import { ButtonItem, Field, PanelSectionRow } from "decky-frontend-lib";
import { FaInfoCircle } from "react-icons/fa";
import { VerticalContainer } from "./vertical-container";
import { Backend, LatestResult, LatestResultFetch } from "../app/backend";
import { LatestResults } from "./latest-results";
import { convertBpsToMbps, getColor } from "../utils";

type AIM = {
  name: string;
  points: number;
  classificationIdx: 0 | 1 | 2 | 3 | 4;
  classificationName: "bad" | "poor" | "average" | "good" | "great";
};

type Props = {
  backend: Backend;
};

export const Stats = ({ backend }: Props) => {
  const [startTest, setStartTest] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState("");

  const [dlPoints, setDlPoints] = useState<BandwidthPoint[]>();
  const [upPoints, setUpPoints] = useState<BandwidthPoint[]>();

  const [download, setDownload] = useState<number | undefined>();
  const [upload, setUpload] = useState<number | undefined>();
  const [latency, setLatency] = useState<number | undefined>();
  const [jitter, setJitter] = useState<number | undefined>();
  const [aimScores, setAimScores] = useState<AIM[] | null>(null);

  const [latestResult, setLatestResult] = useState<LatestResultFetch>();

  const CollectEngineStats = () => {
    backend.engine.onResultsChange = () => {
      if (!backend.engine.isFinished) {
        setDlPoints(backend.engine.results.getDownloadBandwidthPoints());
        setUpPoints(backend.engine.results.getUploadBandwidthPoints());
        const download = backend.engine.results.getDownloadBandwidth();
        const upload = backend.engine.results.getUploadBandwidth();

        const latencyDown = backend.engine.results.getDownLoadedLatency();
        const latencyUp = backend.engine.results.getUpLoadedLatency();

        const jitterDown = backend.engine.results.getDownLoadedJitter();
        const jitterUp = backend.engine.results.getUpLoadedJitter();

        if (download) {
          setDownload(convertBpsToMbps(download));
        }
        if (upload) {
          setUpload(convertBpsToMbps(upload));
        }
        if (latencyDown && latencyUp) {
          setLatency(Math.round((latencyDown + latencyUp) / 2));
        }
        if (jitterDown && jitterUp) {
          setJitter(Math.round((jitterDown + jitterUp) / 2));
        }
      } else {
        setIsFinished(true);
        setIsRunning(false);

        const aimScores = Object.entries(
          backend.engine.results.getScores()
        ).map(([key, value]) => ({
          name: key,
          ...value,
        }));

        setAimScores(aimScores);

        const {
          download,
          upload,
          downLoadedLatency,
          upLoadedLatency,
          downLoadedJitter,
          upLoadedJitter,
        } = backend.engine.results.getSummary();

        if (
          download &&
          upload &&
          downLoadedJitter &&
          upLoadedJitter &&
          downLoadedLatency &&
          upLoadedLatency &&
          download > 0 &&
          upload > 0 &&
          downLoadedJitter > 0 &&
          upLoadedJitter > 0 &&
          downLoadedLatency > 0 &&
          upLoadedLatency > 0
        ) {
          setDownload(convertBpsToMbps(download));

          setUpload(convertBpsToMbps(upload));

          setLatency(Math.round((downLoadedLatency + upLoadedLatency) / 2));

          setJitter(Math.round((downLoadedJitter + upLoadedJitter) / 2));
        } else {
          setError("Wasn't able to complete speed test, try restarting steam");
        }
      }
    };
  };

  const Play = () => {
    if (backend.engine.isFinished) {
      backend.engine.restart();
      setError("");
    } else {
      backend.engine.play();
    }

    setIsRunning(true);
  };

  useEffect(() => {
    if (isRunning) {
      CollectEngineStats();
    }
  }, [isRunning]);

  useEffect(() => {
    if (startTest) {
      Play();
      console.log("started speed test");
    }
  }, [startTest]);

  useEffect(() => {
    if (backend.engine.isRunning) {
      setIsRunning(true);
    }
    if (backend.LatestTestResults !== null) {
      console.log(backend.LatestTestResults);
      setLatestResult(backend.LatestTestResults);
    }
  }, []);

  const dlInMbps = dlPoints?.map((item) => {
    return {
      ...item,
      bps: convertBpsToMbps(item.bps),
    };
  });

  const upInMbps = upPoints?.map((item) => {
    return {
      ...item,
      bps: convertBpsToMbps(item.bps),
    };
  });

  return (
    <>
      {!isRunning && !isFinished && (
        <PanelSectionRow>
          <ButtonItem onClick={() => setStartTest(true)} layout="below">
            START TEST
          </ButtonItem>
        </PanelSectionRow>
      )}

      {latestResult && latestResult.msg && !isRunning && !isFinished && (
        <LatestResults results={latestResult.data} />
      )}

      {(isRunning || isFinished) && (
        <div style={{ fontWeight: 600, paddingBottom: "8px" }}>
          <PanelSectionRow>
            <Field
              label="STATUS"
              inlineWrap="keep-inline"
              bottomSeparator="thick"
            >
              {isRunning && "RUNNING"}
              {isFinished && "FINISHED"}
            </Field>
          </PanelSectionRow>
        </div>
      )}

      {error && (
        <VerticalContainer style={{ padding: "16px 0" }}>
          <div
            style={{ fontSize: "16px", textAlign: "center", fontWeight: 600 }}
          >
            {error.toUpperCase()}
          </div>
        </VerticalContainer>
      )}

      {error === "" && (isRunning || isFinished) && (
        <>
          <PanelSectionRow>
            <Field label="DOWNLOAD" inlineWrap="keep-inline" focusable>
              {download && (
                <div style={{ fontWeight: 600 }}>{download} Mbps</div>
              )}
            </Field>
          </PanelSectionRow>

          {isRunning && dlInMbps && dlInMbps.length > 2 && (
            <Graph data={dlInMbps} />
          )}

          <PanelSectionRow>
            <Field label="UPLOAD" inlineWrap="keep-inline" focusable>
              {upload && (
                <div style={{ fontWeight: 600 }}>{upload ?? "?"} Mbps</div>
              )}
            </Field>
          </PanelSectionRow>

          {isRunning && upInMbps && upInMbps.length > 2 && (
            <Graph data={upInMbps} type="up" />
          )}

          <PanelSectionRow>
            <Field label="PING" inlineWrap="keep-inline" focusable>
              {latency && (
                <div style={{ fontWeight: 600 }}>{latency ?? "?"} ms</div>
              )}
            </Field>
          </PanelSectionRow>

          <PanelSectionRow>
            <Field label="JITTER" inlineWrap="keep-inline" focusable>
              {jitter && (
                <div style={{ fontWeight: 600 }}>{jitter ?? "?"} ms</div>
              )}
            </Field>
          </PanelSectionRow>

          {isFinished && (
            <div style={{ paddingTop: "16px", paddingBottom: "8px" }}>
              <PanelSectionRow>
                <Field
                  label="Summary scores"
                  description="Based on AIM score"
                  bottomSeparator="thick"
                  focusable
                >
                  <FaInfoCircle />
                </Field>
              </PanelSectionRow>
            </div>
          )}

          <div style={{ paddingBottom: "16px" }}>
            {isFinished &&
              aimScores !== null &&
              aimScores.map((item) => (
                <PanelSectionRow>
                  <Field label={item.name.toUpperCase()} focusable>
                    <div
                      style={{
                        fontWeight: 600,
                        color: getColor(item.classificationIdx),
                      }}
                    >
                      {item.classificationName.toUpperCase()}
                    </div>
                  </Field>
                </PanelSectionRow>
              ))}
          </div>
        </>
      )}
      {isFinished && !error && (
        <PanelSectionRow>
          <ButtonItem onClick={() => setStartTest(true)} layout="below">
            REPEAT TEST
          </ButtonItem>
        </PanelSectionRow>
      )}
    </>
  );
};
