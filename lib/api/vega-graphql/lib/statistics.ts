/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: statistics
// ====================================================

export interface statistics_statistics {
  __typename: "Statistics";
  /**
   * Current block number
   */
  blockHeight: number;
  /**
   * Number of items in the backlog
   */
  backlogLength: number;
  /**
   * Number of the trades per seconds
   */
  tradesPerSecond: number;
  /**
   * Average number of orders added per blocks
   */
  averageOrdersPerBlock: number;
  /**
   * Number of orders per seconds
   */
  ordersPerSecond: number;
  /**
   * Number of transaction processed per block
   */
  txPerBlock: number;
  /**
   * Duration of the last block, in nanoseconds
   */
  blockDuration: number;
  /**
   * Status of the vega application connection with the chain
   */
  status: string;
  /**
   * Total number of peers on the vega network
   */
  totalPeers: number;
  /**
   * Total number of orders
   */
  totalOrders: number;
  /**
   * Total number of trades
   */
  totalTrades: number;
  /**
   * RFC3339Nano current time of the chain (decided through consensus)
   */
  vegaTime: string;
  /**
   * Version of the vega node (semver)
   */
  appVersion: string;
  /**
   * Version of the chain (semver)
   */
  chainVersion: string;
  /**
   * RFC3339Nano uptime of the node
   */
  upTime: string;
}

export interface statistics_networkParameters {
  __typename: "NetworkParameter";
  /**
   * The name of the network parameter
   */
  key: string;
  /**
   * The value of the network parameter
   */
  value: string;
}

export interface statistics {
  /**
   * a bunch of statistics about the node
   */
  statistics: statistics_statistics;
  /**
   * return the full list of network parameters
   */
  networkParameters: statistics_networkParameters[] | null;
}
