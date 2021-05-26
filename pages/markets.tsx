import { gql, useQuery } from "@apollo/client";
import Head from "next/head";
import React from "react";
import { Table } from "../components/Table";

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

export default function Markets() {
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

  const markets = data.markets.map((market: any) => ({
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
        <Table markets={markets} />
      </div>
    </div>
  );
}
