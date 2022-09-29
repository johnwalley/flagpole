import React, { ReactElement, ReactNode } from "react";
import type { AppProps } from "next/app";
import { SWRConfig } from "swr";
import { request } from "graphql-request";

import "../styles/globals.css";
import { NextPage } from "next";

/* const fetcher = (query, variables) =>
  request("https://api.n08.testnet.vega.xyz/graphql", query, variables);
 */

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => page);

  return getLayout(
    <SWRConfig
      value={{
        fetcher: (resource, init) =>
          fetch(resource, init).then((res) => res.json()),
      }}
    >
      <Component {...pageProps} />
    </SWRConfig>
  );
}
