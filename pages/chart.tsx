import { gql, useQuery } from "@apollo/client";
import Head from "next/head";
import React, { useMemo, useState } from "react";
import { VegaDataSource } from "../lib/vega-protocol-data-source";
import { client } from "../lib/apollo-client";
import { Interval } from "../lib/api/vega-graphql";
import { PennantChart } from "../components/PennantChart";
import { ListBox, Option } from "../components/ListBox";
import { markets } from "../lib/api/vega-graphql/lib/market";
import { marketsQuery } from "../lib/api/vega-graphql/queries/markets";

export default function Chart() {
  const [selectedMarket, setSelectedMarket] = useState<Option>(null!);

  const { data, loading, error } = useQuery<markets>(marketsQuery, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data.markets) {
        setSelectedMarket({
          id: data.markets[0].id,
          name: data.markets[0].name,
        });
      }
    },
  });

  const dataSource = useMemo(
    () =>
      new VegaDataSource(
        client,
        selectedMarket?.id,
        "0a0ed5f704cf29041bfa320b1015b0b0c0eedb101954ecd687e513d8472a3ff6",
        console.log
      ),
    [selectedMarket]
  );

  if (loading || selectedMarket === null || !data || data.markets === null) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const marketList = data.markets.map((market: any) => ({
    id: market.id,
    name: market.name,
    code: market.tradableInstrument.instrument.code,
    asset: market.tradableInstrument.instrument.product.settlementAsset.symbol,
    markPrice: market.data.markPrice,
  }));

  let initialSelectedMarket = selectedMarket;

  /*   if (!previousData) {
    initialSelectedMarket = {
      id: data.markets[0].tradableInstrument.instrument.code,
      name: data.markets[0].name,
    };
  } */

  const interval = Interval.I1M;

  return (
    <div className="h-full">
      <Head>
        <title>Chart - The fastest way to follow Vega markets</title>
        <meta
          name="description"
          content="The fastest way to follow Vega markets"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="py-4 h-full">
        <ListBox
          label="Market"
          options={marketList.map((market) => ({
            id: market.id,
            name: market.name,
          }))}
          selected={selectedMarket}
          onSelectedChanged={setSelectedMarket}
        />
        <div className="h-full mt-6">
          <PennantChart dataSource={dataSource} interval={interval} />
        </div>
      </div>
    </div>
  );
}
