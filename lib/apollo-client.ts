import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://lb.testnet.vega.xyz/query",
  cache: new InMemoryCache(),
});
