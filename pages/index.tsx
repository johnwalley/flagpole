import { gql, useQuery } from "@apollo/client";
import Head from "next/head";
import React, { useState } from "react";
import { Modal } from "../components/Modal";

const QUERY = gql`
  query statistics {
    statistics {
      blockHeight
      backlogLength
      tradesPerSecond
      averageOrdersPerBlock
      ordersPerSecond
      txPerBlock
      blockDuration
      status
      totalPeers
      totalOrders
      totalTrades
      vegaTime
      appVersion
      chainVersion
      upTime
    }
    networkParameters {
      key
      value
    }
  }
`;

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const { data, loading, error } = useQuery(QUERY, {
    pollInterval: 4000,
  });

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <div>
      <Head>
        <title>Flagpole - The fastest way to follow Vega markets</title>
        <meta
          name="description"
          content="The fastest way to follow Vega markets"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="py-4">
        <div className="max-w-7xl mx-auto py-4 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="text-white block">
              The fastest way to follow Vega markets
            </span>
            <span className="block text-pink-600">
              An unofficial client for Fairground
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
                onClick={() => {
                  setOpen(true);
                }}
              >
                Login
              </a>
            </div>
            <div className="ml-3 inline-flex rounded-md shadow">
              <a
                href="#"
                className="inline-flex items-center justify-center px-5 py-3 border border-gray-700 text-base font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800"
                onClick={() => {
                  setOpen(true);
                }}
              >
                Create account
              </a>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <h3 className="text-lg leading-6 font-medium text-gray-100">
            Network
          </h3>
          <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
            {[
              {
                name: "Block height",
                stat: new Intl.NumberFormat().format(
                  data.statistics.blockHeight
                ),
              },
              { name: "Backlog length", stat: data.statistics.backlogLength },
              {
                name: "Trades per second",
                stat: data.statistics.tradesPerSecond,
              },
            ].map((item) => (
              <div
                key={item.name}
                className="px-4 py-5 bg-gray-800 shadow rounded-lg overflow-hidden sm:p-6"
              >
                <dt className="text-sm font-medium text-gray-400 truncate">
                  {item.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-100">
                  {item.stat}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
      <Modal open={open} onOpenChanged={setOpen} />
    </div>
  );
}
