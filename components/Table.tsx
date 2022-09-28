import Link from "next/link";
import React from "react";
import {
  ChartBarIcon,
  ClipboardListIcon,
  FlagIcon,
  HomeIcon,
  LibraryIcon,
  KeyIcon,
  MenuIcon,
  TrendingUpIcon,
  XIcon,
} from "@heroicons/react/outline";

export type TableProps = {
  markets: {
    id: string;
    name: string;
    code: string;
    asset: string;
    markPrice: string;
  }[];
};

export function Table({ markets }: TableProps) {
  return (
    <div className="flex flex-col">
      <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div className="shadow overflow-hidden border-b border-gray-800 sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-gray-700">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Code
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Asset
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider"
                  >
                    Last price
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Chart</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {markets.map((market, personIdx) => (
                  <tr
                    key={market.id}
                    className={
                      personIdx % 2 === 0 ? "bg-gray-800" : "bg-gray-700"
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-100">
                      <Link href={`/markets/${market.id}`}>{market.name}</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {market.code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {market.asset}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm ordinal slashed-zero tabular-nums text-gray-300">
                      {new Intl.NumberFormat("en-US", {
                        maximumFractionDigits: 5,
                        minimumFractionDigits: 5,
                      }).format(
                        parseInt(market.markPrice, 10) / Math.pow(10, 5)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/markets/${market.id}`}>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-grey-100"
                        >
                          <LibraryIcon
                            className="h-8 w-auto stroke-current text-grey-600"
                            aria-hidden="true"
                          />
                        </a>
                      </Link>
                      <Link href={`/chart/${market.id}`}>
                        <a
                          href="#"
                          className="text-gray-400 hover:text-grey-100"
                        >
                          <ChartBarIcon
                            className="h-8 w-auto stroke-current text-grey-600"
                            aria-hidden="true"
                          />
                        </a>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
