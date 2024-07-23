import {
  ConfirmModal,
  Field,
  PanelSectionRow,
  showModal,
} from "decky-frontend-lib";
import { TbWorldUpload, TbWorldDownload } from "react-icons/tb";
import { LatestResult } from "../app/backend";
import { HorizontalContainer } from "./horizontal-container";
import { useMemo } from "react";
import { compareDateToNow } from "../utils";
import { FaInfoCircle } from "react-icons/fa";
import { unstyled_p } from "../styles";

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
        <Field
          label="WIFI"
          inlineWrap="keep-inline"
          padding="compact"
          icon={<FaInfoCircle />}
          onClick={() => {
            showModal(
              <ConfirmModal
                strTitle="Wifi"
                strOKButtonText="Got it"
                bAlertDialog
              >
                <div>
                  Shows name of the Wi-Fi network on which test was taken
                </div>
              </ConfirmModal>
            );
          }}
        >
          <div style={{ fontWeight: 600 }}>{results.network_name}</div>
        </Field>
      </PanelSectionRow>

      <PanelSectionRow>
        <Field
          label="SPEED"
          inlineWrap="keep-inline"
          padding="compact"
          icon={<FaInfoCircle />}
          onClick={() => {
            showModal(
              <ConfirmModal
                strTitle="Speed"
                strOKButtonText="Got it"
                bAlertDialog
              >
                <p style={{ ...unstyled_p, paddingBottom: "8px" }}>
                  <div style={{ display: "inline-flex", paddingRight: "2px" }}>
                    <TbWorldDownload
                      style={{
                        height: "1em",
                        width: "1em",
                        top: ".125em",
                        position: "relative",
                      }}
                      color="#f6821f"
                    />
                  </div>
                  <span style={{ fontWeight: 600 }}>Download </span>
                  determines how fast your network connection can get data from
                  the test network. This is important when downloading large
                  files such as updates for applications or streaming video
                  services. Download speed is tested by downloading files of
                  various sizes.
                </p>
                <p style={{ ...unstyled_p, paddingBottom: "8px" }}>
                  <div style={{ display: "inline-flex", paddingRight: "2px" }}>
                    <TbWorldUpload
                      style={{
                        height: "1em",
                        width: "1em",
                        top: ".125em",
                        position: "relative",
                      }}
                      color="#8d1eb1"
                    />
                  </div>
                  <span style={{ fontWeight: 600 }}>Upload </span>
                  determines how fast your network connection can transfer data
                  to the test network. This is especially important for
                  applications such as FTP or if you are the source for a live
                  video stream. Upload speed is tested by uploading files of
                  various sizes.
                </p>
                <div>
                  Both numbers reported represents the 90th percentile of all
                  download/upload measurements and not the absolute maximum.
                </div>
              </ConfirmModal>
            );
          }}
        >
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
        <Field
          label="PING"
          inlineWrap="keep-inline"
          padding="compact"
          icon={<FaInfoCircle />}
          onClick={() => {
            showModal(
              <ConfirmModal
                strTitle="Ping"
                strOKButtonText="Got it"
                bAlertDialog
              >
                <div style={{ paddingBottom: "8px" }}>
                  Round trip time latency (or RTT) is the time it takes for a
                  packet to be sent from your computer to Cloudflare's network
                  and back. It is especially important for applications such as
                  gaming and video chat, where you want to be as up to date as
                  possible.
                </div>
                <div>
                  The number reported represents the median of all RTT
                  measurements. Lower RTT is better.
                </div>
              </ConfirmModal>
            );
          }}
        >
          <div style={{ fontWeight: 600 }}>{results.latency} ms</div>
        </Field>
      </PanelSectionRow>

      <PanelSectionRow>
        <Field
          label="JITTER"
          inlineWrap="keep-inline"
          padding="compact"
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
                  picture. RTT can go up and down from time to time, which is
                  noticeable in applications like video chat, gaming, or
                  streaming. Jitter gives you insight into how much variation we
                  see in the RTT measurements.
                </div>
                <div>
                  It's calculated as the average distance between consecutive
                  RTT measurements. Lower jitter is better.
                </div>
              </ConfirmModal>
            );
          }}
        >
          <div style={{ fontWeight: 600 }}>{results.jitter} ms</div>
        </Field>
      </PanelSectionRow>
    </>
  );
};
