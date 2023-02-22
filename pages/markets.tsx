import React, { ReactElement, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import Layout from "../components/layout";
import { sortBy } from "lodash";
import {
  Column,
  Table as ReactTable,
  PaginationState,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  ColumnDef,
  OnChangeFn,
  createColumnHelper,
  flexRender,
  getSortedRowModel,
  SortingState,
} from "@tanstack/react-table";

export type Market = {
  id: string;
  name: string;
  fullName: string;
  price: number;
  symbol: string;
  dayChange: number;
  volume: number;
  marketCap: number;
};

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
});

const percentageFormatter = new Intl.NumberFormat("en-US", {
  style: "percent",
  minimumFractionDigits: 2,
});

const volumeFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const marketCapFormatter = new Intl.NumberFormat("en-US", {
  notation: "compact",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const columnHelper = createColumnHelper<Market>();

const columns = [
  columnHelper.accessor("name", {
    header: "Name",
    size: 220,
    sortingFn: "text",
    cell: (info) => (
      <div className="flex flex-row items-center">
        <div className="font-medium text-gray-900 dark:text-white">
          {info.row.original.name}
        </div>
        <div className="ml-4 text-gray-500 max-w-[110px] whitespace-normal">
          {info.row.original.fullName}
        </div>
      </div>
    ),
  }),
  columnHelper.accessor("price", {
    header: "Price",
    cell: (info) => currencyFormatter.format(info.getValue()),
  }),
  columnHelper.accessor("dayChange", {
    header: "Change",
    cell: (info) => (
      <span
        className={`${info.getValue() < 0 ? "text-red-500" : "text-green-500"}`}
      >
        {percentageFormatter.format(info.getValue() / 100)}
      </span>
    ),
  }),
  columnHelper.accessor("volume", {
    header: "Volume",
    cell: (info) => volumeFormatter.format(info.getValue()),
  }),
  columnHelper.accessor("marketCap", {
    header: "Market cap",
    cell: (info) => marketCapFormatter.format(info.getValue()),
  }),
];

function Markets() {
  const { data: list, error } = useSWR<{ data: Market[] }>(
    "https://www.binance.com/bapi/composite/v1/public/marketing/symbol/list"
  );

  const [sorting, setSorting] = useState<SortingState>([]);

  const sortedData = useMemo(
    () => (list ? sortBy(list.data, "rank") : []),
    [list]
  );

  const table = useReactTable<Market>({
    data: sortedData,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });

  if (!list) {
    return <p>Loading</p>;
  }

  return (
    <React.Fragment>
      <Head>
        <title>Markets | Flagpole</title>
      </Head>
      <div className="grid grid-col-1 text-2xl w-full text-center text-gray-900 dark:text-white">
        <span>Markets</span>
      </div>
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="mt-8 flex flex-col">
          <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table className="min-w-full divide-y divide-gray-300">
                  <thead className="bg-gray-50 dark:bg-black">
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                            style={{
                              width: header.getSize(),
                              flex: `${header.getSize()} 1 0%`,
                            }}
                          >
                            {header.isPlaceholder ? null : (
                              <div
                                {...{
                                  className: header.column.getCanSort()
                                    ? "cursor-pointer select-none"
                                    : "",
                                  onClick:
                                    header.column.getToggleSortingHandler(),
                                }}
                              >
                                {flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                              </div>
                            )}
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>

                  <tbody className="divide-y divide-gray-600 bg-white dark:bg-gray-900">
                    {table.getRowModel().rows.map((row) => (
                      <Link key={row.id} href={`/trade/${row.original.symbol}`}>
                        <tr
                          className={`hover:bg-white dark:hover:bg-black cursor-pointer h-[64px]`}
                        >
                          {row.getVisibleCells().map((cell) => (
                            <td
                              key={cell.id}
                              className="whitespace-nowrap py-2 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6"
                            >
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </td>
                          ))}
                        </tr>
                      </Link>
                    ))}
                  </tbody>
                </table>
                <div className="h-2" />
                <div className="flex items-center gap-2 dark:text-white">
                  <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {"<<"}
                  </button>
                  <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                  >
                    {"<"}
                  </button>
                  <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                  >
                    {">"}
                  </button>
                  <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                  >
                    {">>"}
                  </button>
                  <span className="flex items-center gap-1">
                    <div>Page</div>
                    <strong>
                      {table.getState().pagination.pageIndex + 1} of{" "}
                      {table.getPageCount()}
                    </strong>
                  </span>
                  <span className="flex items-center gap-1">
                    | Go to page:
                    <input
                      type="number"
                      defaultValue={table.getState().pagination.pageIndex + 1}
                      onChange={(e) => {
                        const page = e.target.value
                          ? Number(e.target.value) - 1
                          : 0;
                        table.setPageIndex(page);
                      }}
                      className="border p-1 rounded w-16"
                    />
                  </span>
                  <select
                    value={table.getState().pagination.pageSize}
                    onChange={(e) => {
                      table.setPageSize(Number(e.target.value));
                    }}
                  >
                    {[10, 20, 30, 40, 50].map((pageSize) => (
                      <option key={pageSize} value={pageSize}>
                        Show {pageSize}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="dark:text-white">
                  {table.getRowModel().rows.length} Rows
                </div>
                <pre className="dark:text-white">
                  {JSON.stringify(table.getState().pagination, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-1 w-full flex-wrap flex justify-center">
        <Link href="/home">
          <a className="btn-blue">Go to home page</a>
        </Link>
      </div>
    </React.Fragment>
  );
}

Markets.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Markets;
