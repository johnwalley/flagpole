import { ApolloClient, InMemoryCache } from "@apollo/client";

export const client = new ApolloClient({
  uri: "https://lb.testnet.vega.xyz/query",
  cache: new InMemoryCache({
    typePolicies: {
      Instrument: {
        // Singleton types that have no identifying field can use an empty
        // array for their keyFields.
        keyFields: ["code"],
      },
    },
  }),
});
