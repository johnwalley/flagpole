import React, { forwardRef, ReactElement, useMemo, useState } from "react";
import Head from "next/head";
import Link from "next/link";
import useSWR from "swr";
import { useRouter } from "next/router";
import {
  Chart,
  DepthChart,
  Interval,
  intervalLabels,
  Study,
  studyLabels,
} from "pennant";
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import "pennant/dist/style.css";
import Layout from "../../components/layout";
import { sortBy, startCase } from "lodash";
import { BinanceDataSource } from "../../helpers/data-source";
import { Fragment } from "react";
import { Listbox, Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { Market } from "../markets";

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

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const studies = [
  { id: 1, study: Study.ELDAR_RAY, label: studyLabels[Study.ELDAR_RAY] },
  { id: 2, study: Study.FORCE_INDEX, label: studyLabels[Study.FORCE_INDEX] },
  { id: 3, study: Study.MACD, label: studyLabels[Study.MACD] },
  {
    id: 4,
    study: Study.RELATIVE_STRENGTH_INDEX,
    label: studyLabels[Study.RELATIVE_STRENGTH_INDEX],
  },
  { id: 5, study: Study.VOLUME, label: studyLabels[Study.VOLUME] },
];

function Trade() {
  const router = useRouter();

  const [selectedStudies, setSelectedStudies] = useState<any[]>([]);

  const { chart, interval, marketId } = router.query;

  const dataSource = useMemo(
    () => new BinanceDataSource(marketId as string),
    [marketId]
  );

  let intervalEnum: Interval = Interval.I1D;
  switch (interval) {
    case intervalLabels[Interval.I5M]:
      intervalEnum = Interval.I5M;
      break;
    case intervalLabels[Interval.I1H]:
      intervalEnum = Interval.I1H;
      break;
  }

  const { data: depth, error: depthError } = useSWR(
    marketId
      ? `https://www.binance.com/api/v3/depth?symbol=${marketId}&limit=1000`
      : null,
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

  const { data: list, error } = useSWR<{ data: Market[] }>(
    "https://www.binance.com/bapi/composite/v1/public/marketing/symbol/list"
  );

  if (!depth || !product || !list) {
    return <p>Loading</p>;
  }

  return (
    <React.Fragment>
      <Head>
        <title>{marketId} | Flagpole</title>
      </Head>
      <div className="h-full dark:text-white">
        <Allotment>
          <Allotment.Pane>
            <Allotment vertical>
              <Allotment.Pane maxSize={68} minSize={68}>
                <div id="subHeader" className="flex">
                  <div className="flex">
                    <div className="ml-1 mr-6 pr-6 flex flex-col">{`${product.data.b}/${product.data.pm}`}</div>
                    <span
                      className={`flex flex-col ${
                        product.data.c < 0 ? "text-red-500" : "text-greemn-500"
                      }`}
                    >{`${product.data.c}`}</span>
                  </div>
                  <span className="ml-4">{`${product.data.h}`}</span>
                  <span className="ml-4">{`${product.data.l}`}</span>
                  <span className="ml-4">{`${product.data.v}`}</span>
                </div>
              </Allotment.Pane>
              <Allotment.Pane>
                <Allotment>
                  <Allotment.Pane preferredSize="25%">
                    <div id="orderBook" className="">
                      Order book
                    </div>
                  </Allotment.Pane>
                  <Allotment.Pane>
                    <div id="chart" className="">
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
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
                                  <MyLink
                                    href={`/trade/${marketId}?chart=candlestick&interval=${intervalLabels[intervalEnum]}`}
                                  >
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
                                  <MyLink
                                    href={`/trade/${marketId}?chart=depth&interval=${intervalLabels[intervalEnum]}`}
                                  >
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
                      <Menu
                        as="div"
                        className="relative inline-block text-left"
                      >
                        <div>
                          <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-700 bg-black px-4 py-2 text-sm font-medium text-gray-300 shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                            {startCase(
                              intervalLabels[intervalEnum] ??
                                intervalLabels[Interval.I5M]
                            )}
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
                                  <MyLink
                                    href={`/trade/${marketId}?chart=${chart}&interval=${
                                      intervalLabels[Interval.I5M]
                                    }`}
                                  >
                                    <a
                                      className={classNames(
                                        active
                                          ? "bg-gray-100 text-gray-900"
                                          : "text-gray-700",
                                        "block px-4 py-2 text-sm"
                                      )}
                                    >
                                      {intervalLabels[Interval.I5M]}
                                    </a>
                                  </MyLink>
                                )}
                              </Menu.Item>
                              <Menu.Item>
                                {({ active }) => (
                                  <MyLink
                                    href={`/trade/${marketId}?chart=${chart}&interval=${
                                      intervalLabels[Interval.I1H]
                                    }`}
                                  >
                                    <a
                                      className={classNames(
                                        active
                                          ? "bg-gray-100 text-gray-900"
                                          : "text-gray-700",
                                        "block px-4 py-2 text-sm"
                                      )}
                                    >
                                      {intervalLabels[Interval.I1H]}
                                    </a>
                                  </MyLink>
                                )}
                              </Menu.Item>
                            </div>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                      <div className="w-48">
                        <Listbox
                          value={selectedStudies}
                          onChange={setSelectedStudies}
                          multiple
                        >
                          {({ open }) => (
                            <>
                              <Listbox.Label className="block text-sm font-medium text-gray-700">
                                Studies
                              </Listbox.Label>
                              <Listbox.Button className="dark:text-black relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-yellow-500 focus:outline-none focus:ring-1 focus:ring-yellow-500 sm:text-sm">
                                <span className="block truncate">
                                  {selectedStudies
                                    .map((study) => study.label)
                                    .join(", ")}
                                </span>
                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                                  <ChevronUpDownIcon
                                    className="h-5 w-5 text-gray-400"
                                    aria-hidden="true"
                                  />
                                </span>
                              </Listbox.Button>

                              <Transition
                                show={open}
                                as={Fragment}
                                leave="transition ease-in duration-100"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                              >
                                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                                  {studies.map((study) => (
                                    <Listbox.Option
                                      key={study.id}
                                      value={study}
                                      className={({ active }) =>
                                        classNames(
                                          active
                                            ? "text-gray-900 bg-yellow-300"
                                            : "text-gray-900",
                                          "relative cursor-default select-none py-2 pl-3 pr-9"
                                        )
                                      }
                                    >
                                      {({ selected, active }) => (
                                        <>
                                          <span
                                            className={classNames(
                                              selected
                                                ? "font-semibold"
                                                : "font-normal",
                                              "block truncate"
                                            )}
                                          >
                                            {study.label}
                                          </span>

                                          {selected ? (
                                            <span
                                              className={classNames(
                                                active
                                                  ? "text-white"
                                                  : "text-yellow-600",
                                                "absolute inset-y-0 right-0 flex items-center pr-4"
                                              )}
                                            >
                                              <CheckIcon
                                                className="h-5 w-5"
                                                aria-hidden="true"
                                              />
                                            </span>
                                          ) : null}
                                        </>
                                      )}
                                    </Listbox.Option>
                                  ))}
                                </Listbox.Options>
                              </Transition>
                            </>
                          )}
                        </Listbox>
                      </div>

                      <div
                        className="h-full relative"
                        style={{ height: "500px" }}
                      >
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
                          <Chart
                            dataSource={dataSource}
                            interval={intervalEnum}
                            options={{
                              studies: selectedStudies.map(
                                (study) => study.study
                              ),
                            }}
                          />
                        )}
                      </div>
                    </div>
                  </Allotment.Pane>
                </Allotment>
              </Allotment.Pane>
            </Allotment>
          </Allotment.Pane>
          <Allotment.Pane preferredSize="20%">
            <Allotment vertical>
              <div id="market" className="h-full overflow-auto pt-4">
                {list.data.map((market) => (
                  <div className="px-4">{market.fullName}</div>
                ))}
              </div>
              <div id="trades" className="h-full overflow-auto pt-4">
                Trades
              </div>
            </Allotment>
          </Allotment.Pane>
        </Allotment>
      </div>
    </React.Fragment>
  );
}

Trade.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Trade;
