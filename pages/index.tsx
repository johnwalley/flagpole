import { gql, useQuery } from "@apollo/client";
import { format, formatDistance } from "date-fns";
import Head from "next/head";
import React, { useState } from "react";
import { Modal } from "../components/Modal";
import { statistics } from "../lib/api/vega-graphql/lib/statistics";
import { networkStatsQuery } from "../lib/api/vega-graphql/queries/statistics";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const { data, loading, error } = useQuery<statistics>(networkStatsQuery, {
    pollInterval: 4000,
  });

  if (loading || !data) {
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
              {
                name: "Average orders per block",
                stat: data.statistics.averageOrdersPerBlock,
              },
              {
                name: "Orders per second",
                stat: data.statistics.ordersPerSecond,
              },
              {
                name: "Transactions per block",
                stat: data.statistics.txPerBlock,
              },
              {
                name: "Block duration time",
                stat: `${Math.floor(data.statistics.blockDuration / 1e6)} ms`,
              },
              {
                name: "Status",
                stat: data.statistics.status,
              },
              {
                name: "Validator nodes",
                stat: data.statistics.totalPeers,
              },
              {
                name: "Total orders",
                stat: new Intl.NumberFormat().format(
                  data.statistics.totalOrders
                ),
              },
              {
                name: "Total trades",
                stat: new Intl.NumberFormat().format(
                  data.statistics.totalTrades
                ),
              },
              {
                name: "Vega time",
                stat: format(new Date(data.statistics.vegaTime), "HH:mm:ss"),
              },
              {
                name: "App version",
                stat: data.statistics.appVersion,
              },
              {
                name: "Chain version",
                stat: data.statistics.chainVersion,
              },
              {
                name: "Up time",
                stat: formatDistance(
                  new Date(data.statistics.upTime),
                  new Date(data.statistics.vegaTime)
                ),
              },
            ].map((item) => (
              <div
                key={item.name}
                className="px-4 py-5 bg-gray-800 shadow rounded-lg overflow-hidden sm:p-6"
              >
                <dt className="text-sm font-medium text-gray-400 truncate">
                  {item.name}
                </dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-100 overflow-ellipsis whitespace-nowrap overflow-hidden">
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
