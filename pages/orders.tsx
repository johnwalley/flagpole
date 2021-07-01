import { useQuery } from "@apollo/client";
import Head from "next/head";
import React from "react";
import { OrdersTable } from "../components/OrdersTable";
import { useUser } from "../data/use-user";
import { order, orderQuery, orderVariables } from "../lib/api/vega-graphql";

export default function Orders() {
  const { user } = useUser();

  const { data, loading, error, subscribeToMore } = useQuery<
    order,
    orderVariables
  >(orderQuery, {
    variables: { partyId: user?.key ?? "" },
    skip: !user?.key,
  });

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    console.error(error);
    return null;
  }

  const orders =
    data?.party?.orders?.map((order) => ({
      id: order.id,
      price: order.price,
      size: order.size,
      side: order.side,
    })) ?? [];

  return (
    <div>
      <Head>
        <title>Orders - The fastest way to follow Vega markets</title>
        <meta
          name="description"
          content="The fastest way to follow Vega markets"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="py-4">
        <OrdersTable orders={orders} />
      </div>
    </div>
  );
}
