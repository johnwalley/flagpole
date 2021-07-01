import { gql } from "@apollo/client";

export const marketsQuery = gql`
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

export const marketNameControlQuery = gql`
  query marketNameQuery($id: ID!) {
    market(id: $id) {
      id
      tradableInstrument {
        instrument {
          metadata {
            tags
          }
          name
          code
        }
      }
      data {
        market {
          id
          state
        }
        marketTradingMode
      }
    }
  }
`;

export const newMarketEventSubscription = gql`
  subscription newMarketEvent {
    busEvents(batchSize: 0, types: [MarketCreated]) {
      eventId
      block
      type
    }
  }
`;

export const marketsForLayoutsQuery = gql`
  query marketsForLayouts {
    markets {
      id
      tradableInstrument {
        instrument {
          id
          name
          code
        }
      }
    }
  }
`;
