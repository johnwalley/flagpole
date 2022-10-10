import React, { ReactElement, useEffect, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/router";
import Allotment from "allotment";
import "allotment/dist/style.css";
import "pennant/dist/style.css";
import Layout from "../../components/layout";
import { sortBy } from "lodash";

function Trade() {
  const router = useRouter();

  const { data: list, error } = useSWR(
    "https://www.binance.com/bapi/composite/v1/public/marketing/symbol/list"
  );

  const sortedData = useMemo(
    () => (list ? sortBy(list.data, "rank") : []),
    [list]
  );

  useEffect(() => {
    if (list && sortedData.length > 0) {
      router.replace(`/trade/${sortedData[0].symbol}`);
    }
  }, [list]);

  return (
    <React.Fragment>
      <Head>
        <title>Trade | Flagpole</title>
      </Head>
      <div className="h-full dark:text-white">
        <span>No markets available</span>
      </div>
    </React.Fragment>
  );
}

Trade.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Trade;
