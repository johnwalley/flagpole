import { Candle, DataSource, Interval } from "pennant";

export class BinanceDataSource implements DataSource {
  get decimalPlaces(): number {
    return 2;
  }

  async onReady() {
    return Promise.resolve({
      decimalPlaces: this.decimalPlaces,
      supportedIntervals: [Interval.I1D, Interval.I1H, Interval.I1M],
      priceMonitoringBounds: {},
    });
  }

  async query(interval: Interval, from: string, to: string): Promise<Candle[]> {
    const limit = 500;
    const toTs = Math.floor(new Date(to).getTime() / 1000);
    let resolution;

    switch (interval) {
      case Interval.I1D:
        resolution = "day";
        break;
      case Interval.I1H:
        resolution = "hour";
        break;
      case Interval.I1M:
        resolution = "minute";
        break;
      default:
        resolution = "minute";
    }

    const res = await fetch(
      `https://www.binance.com/api/v3/uiKlines?limit=1000&symbol=BTCBUSD&interval=1d`
    );

    const data = await res.json();

    console.log(data);

    return data.map((d: any) => ({
      date: new Date(d[0]),
      open: Number(d[1]),
      close: Number(d[4]),
      high: Number(d[2]),
      low: Number(d[3]),
      volume: Number(d[5]),
    }));
  }

  subscribeData(
    _interval: Interval,
    onSubscriptionData: (datum: any) => void
  ) {}

  unsubscribeData() {}
}
