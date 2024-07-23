import { useEffect, useState } from "react";
import { BandwidthPoint, Graph } from "./graph";
import {
  ButtonItem,
  ConfirmModal,
  Field,
  Navigation,
  PanelSectionRow,
  showModal,
} from "decky-frontend-lib";
import { FaInfoCircle } from "react-icons/fa";
import { VerticalContainer } from "./vertical-container";
import { Backend, LatestResultFetch } from "../app/backend";
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
      setDownload(undefined);
      setUpload(undefined);
      setLatency(undefined);
      setJitter(undefined);
      setIsFinished(false);
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
            <Field
              label="DOWNLOAD"
              icon={<FaInfoCircle />}
              inlineWrap="keep-inline"
              onClick={() => {
                showModal(
                  <ConfirmModal
                    strTitle="Download"
                    strOKButtonText="Got it"
                    bAlertDialog
                  >
                    <div style={{ paddingBottom: "8px" }}>
                      Download determines how fast your network connection can
                      get data from the test network. This is important when
                      downloading large files such as updates for applications
                      or streaming video services. Download speed is tested by
                      downloading files of various sizes.
                    </div>
                    <div>
                      The number reported represents the 90th percentile of all
                      download measurements and not the absolute maximum.
                    </div>
                  </ConfirmModal>
                );
              }}
            >
              {download && (
                <div style={{ fontWeight: 600 }}>{download} Mbps</div>
              )}
            </Field>
          </PanelSectionRow>
          {isRunning && dlInMbps && dlInMbps.length > 2 && (
            <Graph data={dlInMbps} />
          )}
          <PanelSectionRow>
            <Field
              label="UPLOAD"
              inlineWrap="keep-inline"
              icon={<FaInfoCircle />}
              onClick={() => {
                showModal(
                  <ConfirmModal
                    strTitle="Upload"
                    strOKButtonText="Got it"
                    bAlertDialog
                  >
                    <div style={{ paddingBottom: "8px" }}>
                      Upload determines how fast your network connection can
                      transfer data to the test network. This is especially
                      important for applications such as FTP or if you are the
                      source for a live video stream. Upload speed is tested by
                      uploading files of various sizes.
                    </div>
                    <div>
                      The number reported represents the 90th percentile of all
                      upload measurements and not the absolute maximum. Scroll
                      down to view details.
                    </div>
                  </ConfirmModal>
                );
              }}
            >
              {upload && (
                <div style={{ fontWeight: 600 }}>{upload ?? "?"} Mbps</div>
              )}
            </Field>
          </PanelSectionRow>
          {isRunning && upInMbps && upInMbps.length > 2 && (
            <Graph data={upInMbps} type="up" />
          )}
          <PanelSectionRow>
            <Field
              label="PING"
              inlineWrap="keep-inline"
              icon={<FaInfoCircle />}
              onClick={() => {
                showModal(
                  <ConfirmModal
                    strTitle="Ping"
                    strOKButtonText="Got it"
                    bAlertDialog
                  >
                    <div style={{ paddingBottom: "8px" }}>
                      Round trip time latency (or RTT) is the time it takes for
                      a packet to be sent from your computer to Cloudflare's
                      network and back. It is especially important for
                      applications such as gaming and video chat, where you want
                      to be as up to date as possible.
                    </div>
                    <div>
                      The number reported represents the median of all RTT
                      measurements. Lower RTT is better.
                    </div>
                  </ConfirmModal>
                );
              }}
            >
              {latency && (
                <div style={{ fontWeight: 600 }}>{latency ?? "?"} ms</div>
              )}
            </Field>
          </PanelSectionRow>

          <PanelSectionRow>
            <Field
              label="JITTER"
              inlineWrap="keep-inline"
              icon={<FaInfoCircle />}
              onClick={() => {
                showModal(
                  <ConfirmModal
                    strTitle="Jitter"
                    strOKButtonText="Got it"
                    bAlertDialog
                  >
                    <div style={{ paddingBottom: "8px" }}>
                      Although median RTT is important, it only paints half the
                      picture. RTT can go up and down from time to time, which
                      is noticeable in applications like video chat, gaming, or
                      streaming. Jitter gives you insight into how much
                      variation we see in the RTT measurements.
                    </div>
                    <div>
                      It's calculated as the average distance between
                      consecutive RTT measurements. Lower jitter is better.
                    </div>
                  </ConfirmModal>
                );
              }}
            >
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
                  onClick={() => {
                    showModal(
                      <ConfirmModal
                        strTitle="Summary Scores"
                        onOK={() => {
                          Navigation.NavigateToExternalWeb(
                            "https://developers.cloudflare.com/speed/aim/"
                          );
                        }}
                        strOKButtonText="Learn more"
                      >
                        <div style={{ paddingBottom: "8px" }}>
                          Aggregated Internet Measurement (AIM) helps you
                          understand your Internet quality to identify scenarios
                          that your Internet connection is good or bad for.
                          Typically, an Internet speed test provides you with
                          upload and download speeds, which may not always
                          provide a holistic view of your Internet quality.
                        </div>
                      </ConfirmModal>
                    );
                  }}
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
          <ButtonItem onClick={() => Play()} layout="below">
            REPEAT TEST
          </ButtonItem>
        </PanelSectionRow>
      )}
    </>
  );
};
