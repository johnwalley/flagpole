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

const popularPairs = [
  "SOLBUSD",
  "SHIBBUSD",
  "ADABUSD",
  "DEGOBUSD",
  "LINKBUSD",
  "BNBBUSD",
  "BTCBUSD",
  "ETHBUSD",
  "LUNCBUSD",
  "ERNBUSD",
];

function Markets() {
  const { data: products, error: productError } = useSWR(
    `https://www.binance.com/bapi/asset/v2/public/asset-service/product/get-products`,
    {
      refreshInterval: 1000,
    }
  );

  const sortedData = useMemo(
    () =>
      products
        ? products.data.filter((product) => popularPairs.includes(product.s))
        : [],
    [products]
  );

  if (!products) {
    return <p>Loading</p>;
  }

  return (
    <React.Fragment>
      <Head>
        <title>Flagpole</title>
      </Head>
      <div className="bg-gray-900">
        <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 md:py-8 lg:px-8 lg:py-10">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
            <span className="block">Make your first trade</span>
            <span className="block text-lg text-gray-300">
              {`Trade ${products.data.length} cryptocurrency and fiat pairs.`}
            </span>
          </h2>
          <div className="mt-8 flex">
            <div className="inline-flex rounded-md shadow">
              <Link href="/trade">
                <a className="inline-flex items-center justify-center rounded-md border border-transparent bg-yellow-300 px-5 py-3 text-base font-medium text-gray-900 hover:bg-yellow-400">
                  Trade
                </a>
              </Link>
            </div>
            <div className="ml-3 inline-flex">
              <Link href="/markets">
                <a className="inline-flex items-center justify-center rounded-md border border-transparent bg-gray-100 px-5 py-3 text-base font-medium text-gray-700 hover:bg-gray-200">
                  Markets
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ul
        role="list"
        className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:grid-cols-5"
      >
        {sortedData.map((product) => (
          <Link key={product.s} href={`trade/${product.s}`}>
            <a>
              <li className="col-span-1 divide-yrounded-lg bg-white dark:bg-black shadow">
                <div className="flex w-full items-center justify-between space-x-6 p-6">
                  <div className="flex-1 truncate">
                    <div className="flex items-center space-x-3">
                      <h3 className="truncate font-medium text-gray-900 dark:text-white">
                        {`${product.b}/${product.pm}`}
                      </h3>
                      <span
                        className={`inline-block flex-shrink-0 px-2 py-0.5 font-medium ${
                          product.c / product.o - 1 < 0
                            ? "text-red-500"
                            : "text-green-500"
                        }`}
                      >
                        {`${percentageFormatter.format(
                          product.c / product.o - 1
                        )}`}
                      </span>
                    </div>
                    <p className="mt-1 truncate text-2xl text-gray-900 dark:text-white">
                      {`${product.c}`}
                    </p>
                  </div>
                </div>
              </li>
            </a>
          </Link>
        ))}
      </ul>
    </React.Fragment>
  );
}

Markets.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Markets;
