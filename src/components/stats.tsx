import { useEffect, useState } from "react";
import { BandwidthPoint, Graph } from "./graph";
import SpeedTestEngine from "@cloudflare/speedtest";
import { ButtonItem, Field, PanelSectionRow } from "decky-frontend-lib";
import { FaInfoCircle } from "react-icons/fa";

function convertBpsToMbps(bps: number): number {
  return Math.round(bps / 1000000); // 1 Mbps = 1,000,000 bps
}

function getColor(value: number): string {
  if (value < 2) {
    return "#FF6557";
  }

  if (value === 2) {
    return "#ffffff";
  }

  if (value > 2) {
    return "#57C042";
  }

  return "#ffffff";
}

type Props = {
  engine: SpeedTestEngine;
};

type AIM = {
  name: string;
  points: number;
  classificationIdx: 0 | 1 | 2 | 3 | 4;
  classificationName: "bad" | "poor" | "average" | "good" | "great";
};

export const Stats = ({ engine }: Props) => {
  const [startTest, setStartTest] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  const [dlPoints, setDlPoints] = useState<BandwidthPoint[]>();
  const [upPoints, setUpPoints] = useState<BandwidthPoint[]>();

  const [download, setDownload] = useState<number | undefined>();
  const [upload, setUpload] = useState<number | undefined>();
  const [latency, setLatency] = useState<number | undefined>();
  const [jitter, setJitter] = useState<number | undefined>();
  const [aimScores, setAimScores] = useState<AIM[] | null>(null);

  const CollectEngineStats = () => {
    engine.onResultsChange = () => {
      if (!engine.isFinished) {
        setDlPoints(engine.results.getDownloadBandwidthPoints());
        setUpPoints(engine.results.getUploadBandwidthPoints());
        const download = engine.results.getDownloadBandwidth();
        const upload = engine.results.getUploadBandwidth();

        const latencyDown = engine.results.getDownLoadedLatency();
        const latencyUp = engine.results.getUpLoadedLatency();

        const jitterDown = engine.results.getDownLoadedJitter();
        const jitterUp = engine.results.getUpLoadedJitter();

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
      }
    };

    engine.onFinish = (results) => {
      setIsFinished(true);
      setIsRunning(false);

      const aimScores = Object.entries(results.getScores()).map(
        ([key, value]) => ({
          name: key,
          ...value,
        })
      );

      setAimScores(aimScores);

      const {
        download,
        upload,
        downLoadedLatency,
        upLoadedLatency,
        downLoadedJitter,
        upLoadedJitter,
      } = results.getSummary();

      if (download) {
        setDownload(convertBpsToMbps(download));
      }
      if (upload) {
        setUpload(convertBpsToMbps(upload));
      }
      if (downLoadedLatency && upLoadedLatency) {
        setLatency(Math.round((downLoadedLatency + upLoadedLatency) / 2));
      }
      if (downLoadedJitter && upLoadedJitter) {
        setJitter(Math.round((downLoadedJitter + upLoadedJitter) / 2));
      }
    };
  };

  const Play = () => {
    if (engine.isFinished) {
      engine.restart();
    } else {
      engine.play();
    }

    setIsRunning(true);
  };

  useEffect(() => {
    if (engine.isRunning) {
      setIsRunning(true);
    }
  }, []);

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

      {(isRunning || isFinished) && (
        <div style={{ fontWeight: 600 }}>
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

      {(isRunning || isFinished) && (
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

          {isFinished &&
            aimScores !== null &&
            aimScores.map((item) => (
              <div style={{ paddingBottom: "16px" }}>
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
              </div>
            ))}
        </>
      )}
      {isFinished && (
        <PanelSectionRow>
          <ButtonItem onClick={() => setStartTest(true)} layout="below">
            REPEAT TEST
          </ButtonItem>
        </PanelSectionRow>
      )}
    </>
  );
};
