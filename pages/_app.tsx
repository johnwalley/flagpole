import "tailwindcss/tailwind.css";
import "pennant/dist/style.css";
import "../styles/global.css";
import React from "react";

import type { AppProps } from "next/app";
import { Layout } from "../components/Layout";
import { ApolloProvider } from "@apollo/client";
import { client } from "../lib/apollo-client";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  if (router.pathname === "/signin") {
    return <Component {...pageProps} />;
  }

  return (
    <ApolloProvider client={client}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ApolloProvider>
  );
}

export default MyApp;
