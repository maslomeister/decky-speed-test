import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useReducer, useState } from "react";
import { tbody, th, table_style, td } from "./table_styles";

function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const year = date.getFullYear().toString().slice(2); // YY
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // MM
  const day = date.getDate().toString().padStart(2, "0"); // DD
  const hours = date.getHours().toString().padStart(2, "0"); // HH
  const minutes = date.getMinutes().toString().padStart(2, "0"); // MM

  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

type AIM = {
  name: string;
  points: number;
  classificationIdx: 0 | 1 | 2 | 3 | 4;
  classificationName: "bad" | "poor" | "average" | "good" | "great";
};

export type TestResult = {
  date_time: string;
  down: number;
  up: number;
  latency: number;
  jitter: number;
  network_name: string;
  aim_scores: AIM[];
};

const columnHelper = createColumnHelper<TestResult>();

const columns = [
  columnHelper.accessor("date_time", {
    cell: (info) => formatDate(info.getValue()),
    header: () => <span>DATE</span>,
  }),
  columnHelper.accessor((row) => row.down, {
    id: "down",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>DOWN</span>,
  }),
  columnHelper.accessor((row) => row.up, {
    id: "up",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>UP</span>,
  }),
  columnHelper.accessor((row) => row.latency, {
    id: "latency",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>PING</span>,
  }),
  columnHelper.accessor((row) => row.jitter, {
    id: "jitter",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>JITTER</span>,
  }),
  columnHelper.accessor((row) => row.network_name, {
    id: "network_name",
    cell: (info) => <i>{info.getValue()}</i>,
    header: () => <span>NETWORK</span>,
  }),
];

type TableProps = {
  incoming_data: TestResult[];
};

export const Table = ({ incoming_data }: TableProps) => {
  const [data, _setData] = useState(() => [...incoming_data]);
  const rerender = useReducer(() => ({}), {})[1];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="p-2">
      <table style={table_style}>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id} style={th}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody style={tbody}>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} style={td}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          {table.getFooterGroups().map((footerGroup) => (
            <tr key={footerGroup.id}>
              {footerGroup.headers.map((header) => (
                <th key={header.id} style={th}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.footer,
                        header.getContext()
                      )}
                </th>
              ))}
            </tr>
          ))}
        </tfoot>
      </table>
    </div>
  );
};
