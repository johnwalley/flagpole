import dynamic from "next/dynamic";
import React from "react";

const DynamicComponent = dynamic<{ dataSource: any; interval: any }>(
  () => import("./NoSSRComponent"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

export type PennantChartProps = {
  dataSource: any;
  interval: any;
};

export function PennantChart({ dataSource, interval }: PennantChartProps) {
  return <DynamicComponent dataSource={dataSource} interval={interval} />;
}
