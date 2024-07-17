import SpeedTest from "@cloudflare/speedtest";

const speedTest = new SpeedTest({ autoStart: false });
speedTest.play();
speedTest.onResultsChange = ({ type }) => {
  // !speedTest.isFinished && setResult(speedTest.results.raw);
  console.log(speedTest.results.raw);
};
