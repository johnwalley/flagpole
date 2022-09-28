import React, { ReactElement, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import Layout from "../components/layout";
import { sortBy } from "lodash";

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

function Markets() {
  const { data: list, error } = useSWR(
    "https://www.binance.com/bapi/composite/v1/public/marketing/symbol/list"
  );

  const sortedData = useMemo(
    () => (list ? sortBy(list.data, "rank") : []),
    [list]
  );

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
                  <thead className="bg-gray-50 dark:bg-gray-900">
                    <tr>
                      <th
                        scope="col"
                        className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-white sm:pl-6"
                      >
                        Name
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        Price
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        Change
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        Volume
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-white"
                      >
                        Market cap
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-6"
                      >
                        <span className="sr-only">Trade</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800">
                    {sortedData.slice(0, 10).map((market, marketIndex) => (
                      <Link href={`/trade/${market.symbol}`}>
                        <tr
                          key={market.id}
                          className={`hover:bg-white dark:hover:bg-black ${
                            marketIndex % 2 === 0 ? undefined : "bg-gray-900"
                          } cursor-pointer`}
                        >
                          <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-white sm:pl-6">
                            <div className="flex flex-row items-center">
                              <div className="font-medium text-gray-900 dark:text-white">
                                {market.name}
                              </div>
                              <div className="ml-4 text-gray-500">
                                {market.fullName}
                              </div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-white">
                            {currencyFormatter.format(market.price)}
                          </td>
                          <td
                            className={`whitespace-nowrap px-3 py-4 text-sm ${
                              market.dayChange < 0
                                ? "text-red-500"
                                : "text-green-500"
                            }`}
                          >
                            {percentageFormatter.format(market.dayChange / 100)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-white">
                            {volumeFormatter.format(market.volume)}
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-white">
                            {marketCapFormatter.format(market.marketCap)}
                          </td>
                          <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <Link href={`/trade/${market.symbol}`}>
                              <a className="text-cyan-600 hover:text-cyan-900">
                                Trade
                                <span className="sr-only">, {market.name}</span>
                              </a>
                            </Link>
                          </td>
                        </tr>
                      </Link>
                    ))}
                  </tbody>
                </table>
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
