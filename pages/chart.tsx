import { gql, useQuery } from "@apollo/client";
import Head from "next/head";
import React, { useMemo, useState } from "react";
import { VegaDataSource } from "../lib/vega-protocol-data-source";
import { client } from "../lib/apollo-client";
import { Interval } from "../lib/api/vega-graphql";
import { PennantChart } from "../components/PennantChart";
import { ListBox, Option } from "../components/ListBox";

const QUERY = gql`
  query markets {
    markets {
      id
      name
      decimalPlaces
      state
      fees {
        factors {
          infrastructureFee
          makerFee
          liquidityFee
        }
      }
      data {
        market {
          id
        }
        bestBidPrice
        bestBidVolume
        bestOfferPrice
        bestOfferVolume
        marketTradingMode
        markPrice
        openInterest
        auctionStart
        auctionEnd
      }
      tradableInstrument {
        instrument {
          id
          metadata {
            tags
          }
          name
          code
          product {
            ... on Future {
              maturity
              quoteName
              settlementAsset {
                id
                symbol
                name
                decimals
              }
            }
          }
        }
      }
    }
  }
`;

export default function Chart() {
  const [selectedMarket, setSelectedMarket] = useState<Option>(null!);
  const { data, previousData, loading, error } = useQuery(QUERY, {
    onCompleted: (data) => {
      setSelectedMarket({
        id: data.markets[0].tradableInstrument.instrument.code,
        name: data.markets[0].name,
      });
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

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const markets = data.markets.map((market: any) => ({
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

  console.log(markets, selectedMarket);

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
          options={markets.map((market: any) => ({
            id: market.code,
            name: market.name,
          }))}
          selected={selectedMarket}
          onSelectedChanged={setSelectedMarket}
        />
        <PennantChart dataSource={dataSource} interval={interval} />
      </div>
    </div>
  );
}
