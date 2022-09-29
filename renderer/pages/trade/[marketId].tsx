import React, { forwardRef, ReactElement, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/router";
import { Chart, DepthChart, Interval } from "pennant";
import Allotment from "allotment";
import "allotment/dist/style.css";
import "pennant/dist/style.css";
import Layout from "../../components/layout";
import { sortBy, startCase } from "lodash";
import { BinanceDataSource } from "../../helpers/data-source";
import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

const MyLink = forwardRef<any, any>((props, ref) => {
  let { href, children, ...rest } = props;
  return (
    <Link href={href}>
      <a ref={ref} {...rest}>
        {children}
      </a>
    </Link>
  );
});

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Trade() {
  const router = useRouter();

  const { chart } = router.query;

  const dataSource = useMemo(() => new BinanceDataSource(), []);

  const { marketId } = router.query;

  const { data: depth, error: depthError } = useSWR(
    `https://www.binance.com/api/v3/depth?symbol=${marketId}&limit=1000
  `,
    {
      refreshInterval: 3000,
    }
  );

  const { data: product, error: productError } = useSWR(
    `https://www.binance.com/bapi/asset/v2/public/asset-service/product/get-product-by-symbol?symbol=${marketId}`,
    {
      refreshInterval: 3000,
    }
  );

  if (!depth || !product) {
    return <p>Loading</p>;
  }

  console.log(chart);

  return (
    <React.Fragment>
      <Head>
        <title>{marketId} | Flagpole</title>
      </Head>
      <div className="h-full dark:text-white">
        <div>
          <span>{`${product.data.b}/${product.data.pm}`}</span>
          <span className="ml-4">{`${product.data.c}`}</span>
          <span className="ml-4">{`${product.data.h}`}</span>
          <span className="ml-4">{`${product.data.l}`}</span>
          <span className="ml-4">{`${product.data.v}`}</span>
        </div>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-700 bg-black px-4 py-2 text-sm font-medium text-gray-300 shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900">
              {startCase((chart as string) ?? "Candlestick")}
              <ChevronDownIcon
                className="-mr-1 ml-2 h-5 w-5"
                aria-hidden="true"
              />
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute left-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <MyLink href={`/trade/${marketId}?chart=candlestick`}>
                      <a
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Candlestick
                      </a>
                    </MyLink>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <MyLink href={`/trade/${marketId}?chart=depth`}>
                      <a
                        className={classNames(
                          active
                            ? "bg-gray-100 text-gray-900"
                            : "text-gray-700",
                          "block px-4 py-2 text-sm"
                        )}
                      >
                        Depth
                      </a>
                    </MyLink>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        <div className="h-full" style={{ height: "500px" }}>
          {chart === "depth" ? (
            <DepthChart
              data={{
                buy: depth.bids
                  ? sortBy(depth.bids, (d) => -Number(d[0])).map(
                      (priceLevel) => ({
                        price: Number(priceLevel[0]),
                        volume: Number(priceLevel[1]),
                      })
                    )
                  : [],
                sell: depth.asks
                  ? sortBy(depth.asks, (d) => Number(d[0])).map(
                      (priceLevel) => ({
                        price: Number(priceLevel[0]),
                        volume: Number(priceLevel[1]),
                      })
                    )
                  : [],
              }}
            />
          ) : (
            <Chart dataSource={dataSource} interval={Interval.I1D} />
          )}
        </div>
      </div>
    </React.Fragment>
  );
}

Trade.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Trade;
