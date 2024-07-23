import { ServerAPI } from "decky-frontend-lib";
import SpeedTestEngine from "@cloudflare/speedtest";
import { convertBpsToMbps } from "../utils";

export type LatestResult = {
  date_time: string;
  down: number;
  up: number;
  latency: number;
  jitter: number;
  network_name: string;
};

type SaveResults = {
  down: number;
  up: number;
  latency: number;
  jitter: number;
  aim_scores: string;
};

export type LatestResultFetch =
  | {
      data: LatestResult;
      msg: true;
    }
  | {
      data: {};
      msg: false;
    };

export class Backend {
  public engine: SpeedTestEngine;
  public serverAPI: ServerAPI;
  public LatestTestResults: LatestResultFetch;

  constructor(engine: SpeedTestEngine, serverAPI: ServerAPI) {
    this.engine = engine;
    this.serverAPI = serverAPI;
    this.LatestTestResults = {
      data: {},
      msg: false,
    };
  }

  public SetLatestResult(res: LatestResultFetch) {
    this.LatestTestResults = res;
  }

  public saveResultsOnFinish(toast: () => void, toastErr: () => void) {
    this.engine.onFinish = (results) => {
      const {
        download,
        upload,
        downLoadedLatency,
        upLoadedLatency,
        downLoadedJitter,
        upLoadedJitter,
      } = results.getSummary();

      const aimScores = Object.entries(results.getScores()).map(
        ([key, value]) => ({
          name: key,
          ...value,
        })
      );

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
        const down = convertBpsToMbps(download);
        const up = convertBpsToMbps(upload);
        const latency = Math.round((downLoadedLatency + upLoadedLatency) / 2);
        const jitter = Math.round((downLoadedJitter + upLoadedJitter) / 2);
        const aim_scores = JSON.stringify(aimScores);

        this.serverAPI
          .callPluginMethod<SaveResults, LatestResult>("save_results", {
            down,
            up,
            latency,
            jitter,
            aim_scores,
          })
          .then((res) => {
            if (res.success) {
              toast();

              // console.log(
              //   "Saved to setLatestResults:",
              //   JSON.stringify(res.result)
              // );
              // console.log(
              //   "LatestResults:",
              //   JSON.stringify(this.LatestTestResults)
              // );
            } else {
              console.log(
                "Failed to save results:" + JSON.stringify(res.result)
              );
            }
          })
          .catch((e) => {
            console.log("Failed to save results:" + JSON.stringify(e));
          });
      } else {
        console.log("Speed Test: failed to complete test");
        toastErr();
      }
    };
  }
}
