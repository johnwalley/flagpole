import { gql, useQuery } from "@apollo/client";
import Head from "next/head";
import React from "react";
import { Table } from "../components/Table";
import { markets } from "../lib/api/vega-graphql/lib/market";
import { marketsQuery } from "../lib/api/vega-graphql/queries/markets";

export default function Markets() {
  const { data, loading, error } = useQuery<markets>(marketsQuery, {
    pollInterval: 4000,
  });

  if (loading || !data || !data.markets) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const marketsList = data.markets.map((market) => ({
    id: market.id,
    name: market.name,
    code: market.tradableInstrument.instrument.code,
    asset: market.tradableInstrument.instrument.product.settlementAsset.symbol,
    markPrice: market.data.markPrice,
  }));

  return (
    <div>
      <Head>
        <title>Markets - The fastest way to follow Vega markets</title>
        <meta
          name="description"
          content="The fastest way to follow Vega markets"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="py-4">
        <Table markets={marketsList} />
      </div>
    </div>
  );
}
