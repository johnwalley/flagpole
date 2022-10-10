import { Candle, DataSource, Interval } from "pennant";

export class BinanceDataSource implements DataSource {
  private webSocket: WebSocket | null = null;
  marketId: string;

  constructor(marketId: string) {
    this.marketId = marketId;
  }

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
        resolution = "1d";
        break;
      case Interval.I1H:
        resolution = "1h";
        break;
      case Interval.I5M:
        resolution = "5m";
        break;
      case Interval.I1M:
        resolution = "1m";
        break;
      default:
        resolution = "1m";
    }

    /* 
1s
1m
3m
5m
15m
30m
1h
2h
4h
6h
8h
12h
1d
3d
1w
1M
*/

    const res = await fetch(
      `https://www.binance.com/api/v3/uiKlines?limit=1000&symbol=${this.marketId}&interval=${resolution}`
    );

    const data = await res.json();

    return data.map((d: any) => ({
      date: new Date(d[0]),
      open: Number(d[1]),
      close: Number(d[4]),
      high: Number(d[2]),
      low: Number(d[3]),
      volume: Number(d[5]),
    }));
  }

  subscribeData(_interval: Interval, onSubscriptionData: (datum: any) => void) {
    if (typeof window !== "undefined") {
      let resolution;

      switch (_interval) {
        case Interval.I1D:
          resolution = "1d";
          break;
        case Interval.I1H:
          resolution = "1h";
          break;
        case Interval.I5M:
          resolution = "5m";
          break;
        case Interval.I1M:
          resolution = "1m";
          break;
        default:
          resolution = "1m";
      }

      this.webSocket = new WebSocket(
        `wss://stream.binance.com/stream?streams=${this.marketId.toLowerCase()}@kline_${resolution}`
      );

      this.webSocket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const k = msg.data.k;

        onSubscriptionData({
          date: new Date(k.t),
          open: Number(k.o),
          close: Number(k.c),
          high: Number(k.h),
          low: Number(k.l),
          volume: Number(k.v),
        });
      };
    }
  }

  unsubscribeData() {
    console.log("Closing socket");
    this.webSocket && this.webSocket.close();
  }
}
