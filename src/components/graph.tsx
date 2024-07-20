import { Area, AreaChart, ResponsiveContainer } from "recharts";

export interface BandwidthPoint {
  bytes: number;
  bps: number;
  duration: number;
  ping: number;
  measTime: number | string;
  serverTime: number;
  transferSize: number;
}
export type GraphProps = {
  data?: BandwidthPoint[];
  type?: "dl" | "up";
};

export const Graph = ({ data, type = "dl" }: GraphProps) => {
  const stroke = type === "dl" ? "#f6821f" : "#8d1eb1";
  const fill = type === "dl" ? "#fbc699" : "#cb99dc";
  return (
    <ResponsiveContainer width="100%" height={50}>
      <AreaChart
        data={data}
        margin={{
          top: 10,
          right: 20,
          left: -20,
          bottom: 10,
        }}
      >
        <Area
          type="monotone"
          dataKey="bps"
          strokeWidth={2}
          stroke={stroke}
          fill={fill}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};
