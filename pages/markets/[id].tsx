import { useQuery } from "@apollo/client";
import Head from "next/head";
import { useRouter } from "next/router";
import React from "react";
import {
  marketDetail,
  marketDetailQuery,
  marketDetailVariables,
} from "../../lib/api/vega-graphql";

const Market = () => {
  const router = useRouter();
  const { id } = router.query;

  const marketId = typeof id === "string" ? id : "";

  const { data, loading, error } = useQuery<
    marketDetail,
    marketDetailVariables
  >(marketDetailQuery, {
    variables: { id: marketId },
    pollInterval: 4000,
  });

  if (loading || !data || !data.market) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  return (
    <div>
      <Head>
        <title>{id} - The fastest way to follow Vega markets</title>
        <meta
          name="description"
          content="The fastest way to follow Vega markets"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="mt-10">
        <h3 className="text-lg leading-6 font-medium text-gray-100">
          Market data
        </h3>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {[
            {
              name: "Best bid",
              stat: data.market.data.bestBidPrice,
            },
            { name: "Best big vol", stat: data.market.data.bestBidVolume },
            {
              name: "Best ask",
              stat: data.market.data.bestOfferPrice,
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
  );
};

export default Market;
