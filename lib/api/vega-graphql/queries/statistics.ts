import { gql } from "@apollo/client";

export const versionsQuery = gql`
  query versions {
    statistics {
      appVersion
      chainVersion
    }
  }
`;

export const blockHeightQuery = gql`
  query blockHeight {
    statistics {
      chainVersion
      blockHeight
      vegaTime
    }
  }
`;

export const networkStatsQuery = gql`
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
