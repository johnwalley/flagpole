import Head from "next/head";
import React, { useState } from "react";

import dynamic from "next/dynamic";
import AllotmentComponent from "../components/AllotmentComponent";

const DynamicComponentWithNoSSR = dynamic(
  () => import("../components/AllotmentComponent"),
  { ssr: false }
);

export default function AllotmentPage() {
  return (
    <div>
      <Head>
        <title>Flagpole - The fastest way to follow Vega markets</title>
        <meta
          name="description"
          content="The fastest way to follow Vega markets"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="py-4">
        <div className="max-w-7xl mx-auto py-4 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            <span className="text-white block">Allotment</span>
            <span className="block text-pink-600">
              A React split view component
            </span>
          </h2>
        </div>
        <div className="mt-10">
          <AllotmentComponent />
        </div>
      </div>
    </div>
  );
}
