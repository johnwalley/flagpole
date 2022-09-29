import React, { ReactElement } from "react";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/router";
import { DepthChart } from "pennant";
import Allotment from "allotment";
import "allotment/dist/style.css";
import "pennant/dist/style.css";
import Layout from "../../components/layout";

function Trade() {
  const router = useRouter();

  const { marketId } = router.query;
  const { data: markets, error: marketsError } = useSWR(
    `fragment MarketFields on Market {
      id
      decimalPlaces
      positionDecimalPlaces
      state
      tradingMode
      fees {
        factors {
          makerFee
          infrastructureFee
          liquidityFee
        }
      }
      tradableInstrument {
        instrument {
          id
          name
          code
          metadata {
            tags
          }
          product {
            ... on Future {
              settlementAsset {
                symbol
                decimals
              }
              quoteName
            }
          }
        }
      }
      marketTimestamps {
        open
        close
      }
    }
    query Markets {
      marketsConnection {
        edges {
          node {
            ...MarketFields
          }
        }
      }
    }`,
    { refreshInterval: 0 }
  );

  const { data, error } = useSWR(
    [
      `query MarketDataQuery($marketId: ID!) {
        marketsConnection(id: $marketId) {
          edges {
            node {
              data {
                market {
                  id
                }
                bestBidPrice
                bestOfferPrice
                markPrice
                trigger
                staticMidPrice
                marketTradingMode
                indicativeVolume
                indicativePrice
                bestStaticBidPrice
                bestStaticOfferPrice
              }
            }
          }
        }
      }`,
      { marketId: marketId },
    ],
    { refreshInterval: 0 }
  );

  const { data: depth, error: depthError } = useSWR(
    [
      `query MarketDepth($marketId: ID!) {
    market(id: $marketId) {
      id
      depth {
        sell {
          price
          volume
          numberOfOrders
        }
        buy {
          price
          volume
          numberOfOrders
        }
        sequenceNumber
      }
    }
  }`,
      { marketId: marketId },
    ],
    { refreshInterval: 0 }
  );

  if (!data || !markets || !depth) {
    return <p>Loading</p>;
  }

  const instrument = markets.marketsConnection.edges.find(
    (edge) => edge.node.id === marketId
  )?.node.tradableInstrument.instrument;

  return (
    <React.Fragment>
      <Head>
        <title>{instrument.code} | Flagpole</title>
      </Head>
      <div className="h-full dark:text-white">
        <div>{instrument.code}</div>
        <div>{data.marketsConnection.edges[0].node.data.markPrice}</div>
        <div className="h-full" style={{ height: "400px" }}>
          <DepthChart
            data={{
              buy: depth.market.depth.buy
                ? depth.market.depth.buy.map((priceLevel) => ({
                    price: Number(priceLevel.price),
                    volume: Number(priceLevel.volume),
                  }))
                : [],
              sell: depth.market.depth.sell
                ? depth.market.depth.sell.map((priceLevel) => ({
                    price: Number(priceLevel.price),
                    volume: Number(priceLevel.volume),
                  }))
                : [],
            }}
          />
        </div>
        <div>
          <ul>
            {markets.marketsConnection.edges.map((edge) => (
              <li key={edge.node.id}>
                <Link href={`/trade/${edge.node.id}`}>
                  <a>{edge.node.tradableInstrument.instrument.code}</a>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </React.Fragment>
  );
}

Trade.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Trade;
