import { useEffect, useRef, useState } from "react";
import { usage_graph } from "./styles";
import { Graph } from "./Graph";
import SpeedTestEngine from "@cloudflare/speedtest";

export const debugBorderEnabled = false;

export type UsageGraphProps = {
  title?: string;
  body?: string;
};

export interface BandwidthPoint {
  bytes: number;
  bps: number;
  duration: number;
  ping: number;
  measTime: number | string;
  serverTime: number;
  transferSize: number;
}

const data = [
  {
    bytes: 100000,
    bps: 2705326.027665411,
    duration: 296.6001109642372,
    ping: 136.70011098807908,
    measTime: "2024-07-17T19:04:52.071Z",
    serverTime: 40.999889,
    transferSize: 100300,
  },
  {
    bytes: 100000,
    bps: 2668439.134678565,
    duration: 300.7001319880791,
    ping: 112.30013201192094,
    measTime: "2024-07-17T19:04:55.603Z",
    serverTime: 37.999868,
    transferSize: 100300,
  },
  {
    bytes: 100000,
    bps: 5772656.388556523,
    duration: 139.000132,
    ping: 73.70013198807908,
    measTime: "2024-07-17T19:04:55.811Z",
    serverTime: 37.999868,
    transferSize: 100300,
  },
  {
    bytes: 100000,
    bps: 2118268.522913192,
    duration: 378.79994501192095,
    ping: 127.999945,
    measTime: "2024-07-17T19:04:56.263Z",
    serverTime: 42.000055,
    transferSize: 100300,
  },
  {
    bytes: 100000,
    bps: 6308179.420968741,
    duration: 127.19993304768371,
    ping: 58.09993302384186,
    measTime: "2024-07-17T19:04:56.450Z",
    serverTime: 55.000067,
    transferSize: 100300,
  },
  {
    bytes: 100000,
    bps: 9845400.34343809,
    duration: 81.499987,
    ping: 70.19998698807908,
    measTime: "2024-07-17T19:04:56.570Z",
    serverTime: 36.000013,
    transferSize: 100300,
  },
  {
    bytes: 100000,
    bps: 10961739.80038287,
    duration: 73.20005898807906,
    ping: 68.80005895231628,
    measTime: "2024-07-17T19:04:56.682Z",
    serverTime: 36.999941,
    transferSize: 100300,
  },
  {
    bytes: 100000,
    bps: 11052349.967158949,
    duration: 72.59994502384185,
    ping: 70.59994502384185,
    measTime: "2024-07-17T19:04:56.799Z",
    serverTime: 42.000055,
    transferSize: 100300,
  },
  {
    bytes: 100000,
    bps: 11317319.170668798,
    duration: 70.90018297615813,
    ping: 58.70018298807907,
    measTime: "2024-07-17T19:04:56.923Z",
    serverTime: 41.999817,
    transferSize: 100300,
  },
  {
    bytes: 100000,
    bps: 3099266.2818244644,
    duration: 258.8999869761582,
    ping: 165.29998701192093,
    measTime: "2024-07-17T19:04:57.244Z",
    serverTime: 36.000013,
    transferSize: 100300,
  },
  {
    bytes: 1000000,
    bps: 32189867.641217615,
    duration: 248.5999659642372,
    ping: 75.999966,
    measTime: "2024-07-17T19:04:57.547Z",
    serverTime: 39.000034,
    transferSize: 1000300,
  },
  {
    bytes: 1000000,
    bps: 31332796.802964017,
    duration: 255.40011797615813,
    ping: 77.70011798807907,
    measTime: "2024-07-17T19:04:57.884Z",
    serverTime: 73.999882,
    transferSize: 1000300,
  },
  {
    bytes: 1000000,
    bps: 34154483.53052079,
    duration: 234.30013201192094,
    ping: 68.30013201192094,
    measTime: "2024-07-17T19:04:58.161Z",
    serverTime: 37.999868,
    transferSize: 1000300,
  },
  {
    bytes: 1000000,
    bps: 31332809.193771634,
    duration: 255.40001697615816,
    ping: 69.10001702384186,
    measTime: "2024-07-17T19:04:58.464Z",
    serverTime: 42.999983,
    transferSize: 1000300,
  },
  {
    bytes: 1000000,
    bps: 32649493.909660645,
    duration: 245.1002769642372,
    ping: 69.10027696423721,
    measTime: "2024-07-17T19:04:58.757Z",
    serverTime: 39.999723,
    transferSize: 1000300,
  },
  {
    bytes: 1000000,
    bps: 36725096.85783347,
    duration: 217.90003797615816,
    ping: 80.90003797615815,
    measTime: "2024-07-17T19:04:59.021Z",
    serverTime: 39.999962,
    transferSize: 1000300,
  },
  {
    bytes: 1000000,
    bps: 35566216.21548348,
    duration: 225.00003800000002,
    ping: 64.10003802384186,
    measTime: "2024-07-17T19:04:59.295Z",
    serverTime: 39.999962,
    transferSize: 1000300,
  },
  {
    bytes: 1000000,
    bps: 31283810.83206511,
    duration: 255.80003801192095,
    ping: 70.10003802384186,
    measTime: "2024-07-17T19:04:59.597Z",
    serverTime: 39.999962,
    transferSize: 1000300,
  },
  {
    bytes: 10000000,
    bps: 61959716.10920487,
    duration: 1291.200234988079,
    ping: 79.80023501192093,
    measTime: "2024-07-17T19:05:04.594Z",
    serverTime: 45.999765,
    transferSize: 10000300,
  },
  {
    bytes: 10000000,
    bps: 51875498.0871227,
    duration: 1542.2001320476838,
    ping: 204.500132,
    measTime: "2024-07-17T19:05:06.247Z",
    serverTime: 37.999868,
    transferSize: 10000300,
  },
  {
    bytes: 10000000,
    bps: 49045114.02186003,
    duration: 1631.2002040476837,
    ping: 101.90020403576278,
    measTime: "2024-07-17T19:05:07.946Z",
    serverTime: 38.999796,
    transferSize: 10000300,
  },
  {
    bytes: 10000000,
    bps: 66474778.62732701,
    duration: 1203.500059,
    ping: 97.10005902384185,
    measTime: "2024-07-17T19:05:09.272Z",
    serverTime: 36.999941,
    transferSize: 10000300,
  },
  {
    bytes: 10000000,
    bps: 60968142.359096475,
    duration: 1312.200058988079,
    ping: 112.70005898807906,
    measTime: "2024-07-17T19:05:10.686Z",
    serverTime: 36.999941,
    transferSize: 10000300,
  },
  {
    bytes: 10000000,
    bps: 91693286.72153245,
    duration: 872.50008,
    ping: 57.70007998807907,
    measTime: "2024-07-17T19:05:11.619Z",
    serverTime: 33.99992,
    transferSize: 10000300,
  },
  {
    bytes: 25000000,
    bps: 106034558.92821081,
    duration: 1886.200140988079,
    ping: 54.80014095231628,
    measTime: "2024-07-17T19:05:15.397Z",
    serverTime: 47.999859,
    transferSize: 25000300,
  },
  {
    bytes: 25000000,
    bps: 117600060.86988539,
    duration: 1700.6997999880791,
    ping: 98.79979995231628,
    measTime: "2024-07-17T19:05:17.168Z",
    serverTime: 40.0002,
    transferSize: 25000300,
  },
  {
    bytes: 25000000,
    bps: 119618657.56847548,
    duration: 1672.000038,
    ping: 62.000038,
    measTime: "2024-07-17T19:05:18.909Z",
    serverTime: 39.999962,
    transferSize: 25000300,
  },
  {
    bytes: 25000000,
    bps: 151954393.09003216,
    duration: 1316.2001830476838,
    ping: 101.80018301192092,
    measTime: "2024-07-17T19:05:20.292Z",
    serverTime: 41.999817,
    transferSize: 25000300,
  },
];

function convertBpsToMbps(bps: number): number {
  return Math.round(bps / 1000000); // 1 Mbps = 1,000,000 bps
}

export const UsageGraph = (props: UsageGraphProps) => {
  const engineRef = useRef<SpeedTestEngine>();
  const [dlPoints, setDlPoints] = useState<BandwidthPoint[]>();
  const [upPoints, setUpPoints] = useState<BandwidthPoint[]>();
  const [download, setDownload] = useState<number | undefined>();

  useEffect(() => {
    engineRef.current = new SpeedTestEngine({ autoStart: false });

    // Clean up if needed when component unmounts
    return () => {
      engineRef.current = undefined; // or any cleanup necessary
    };
  }, []);

  const Play = () => {
    const engine = engineRef.current;

    if (engine !== undefined) {
      engine.play();
      engine.onResultsChange = ({ type }) => {
        if (!engine.isFinished) {
          setDlPoints(engine.results.getDownloadBandwidthPoints());
          setUpPoints(engine.results.getDownloadBandwidthPoints());
          const download = engine.results.getDownloadBandwidth();
          if (download) {
            setDownload(convertBpsToMbps(download));
          }
          const upload = engine.results.getUploadBandwidth();
        }
      };

      engine.onFinish = ({ type }) => {
        console.log(engine.results.getSummary());
      };
    }
  };

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
    <div
      style={{
        ...usage_graph,
        height: "200px",
        border: debugBorderEnabled ? "red solid 2px" : undefined,
        borderRadius: "16px",
      }}
    >
      <button onClick={Play}>PLAY</button>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          color: "white",
        }}
      >
        <p>DOWNLOAD</p>
        {download && <p>{download} Mbps</p>}
      </div>

      <Graph data={dlInMbps} />
      <Graph data={upInMbps} type="up" />
    </div>
  );
};
