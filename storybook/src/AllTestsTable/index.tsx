import { Table, TestResult } from "./table";

const defaultData: TestResult[] = [
  {
    date_time: "2024-07-23T18:42:40.429548",
    down: 5,
    up: 501,
    latency: 26,
    jitter: 24,
    network_name: "hh",
    aim_scores: [
      {
        name: "streaming",
        points: 30,
        classificationIdx: 2,
        classificationName: "average",
      },
      {
        name: "gaming",
        points: 25,
        classificationIdx: 3,
        classificationName: "good",
      },
      {
        name: "rtc",
        points: 35,
        classificationIdx: 3,
        classificationName: "good",
      },
    ],
  },
  {
    date_time: "2024-07-23T17:00:00.423051",
    down: 32,
    up: 3,
    latency: 125,
    jitter: 59,
    network_name: "フォン ɥh",
    aim_scores: [
      {
        name: "streaming",
        points: 10,
        classificationIdx: 0,
        classificationName: "bad",
      },
      {
        name: "gaming",
        points: 0,
        classificationIdx: 0,
        classificationName: "bad",
      },
      {
        name: "rtc",
        points: 5,
        classificationIdx: 1,
        classificationName: "poor",
      },
    ],
  },
  {
    date_time: "2024-07-23T16:53:00.632922",
    down: 42,
    up: 5,
    latency: 148,
    jitter: 47,
    network_name: "フォン ɥh",
    aim_scores: [
      {
        name: "streaming",
        points: 0,
        classificationIdx: 0,
        classificationName: "bad",
      },
      {
        name: "gaming",
        points: 0,
        classificationIdx: 0,
        classificationName: "bad",
      },
      {
        name: "rtc",
        points: 0,
        classificationIdx: 0,
        classificationName: "bad",
      },
    ],
  },
  {
    date_time: "2024-07-23T16:35:28.784470",
    down: 395,
    up: 356,
    latency: 45,
    jitter: 6,
    network_name: "hh",
    aim_scores: [
      {
        name: "streaming",
        points: 40,
        classificationIdx: 3,
        classificationName: "good",
      },
      {
        name: "gaming",
        points: 10,
        classificationIdx: 1,
        classificationName: "poor",
      },
      {
        name: "rtc",
        points: 10,
        classificationIdx: 1,
        classificationName: "poor",
      },
    ],
  },
];

export const AllTestsTable = () => {
  return (
    <div style={{ maxWidth: "1280px" }}>
      <Table incoming_data={defaultData} />
    </div>
  );
};
