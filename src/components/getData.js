import Binance from "binance-api-node";
import { conf } from "./conf";

export async function getData() {
  const client = Binance();
  const data = {
    colors: { low: conf.colors.low, high: conf.colors.high },
    columns: {
      times: [],
      low: [],
      high: [],
    },
  };

  const resp = await client.futuresCandles({
    symbol: "BTCUSDT",
    interval: "5m",
    limit: 100,
  });

  resp.forEach((i) => {
    data.columns.times.push(i.openTime);
    data.columns.low.push(+i.low);
    data.columns.high.push(+i.high);
  });
  return data;
}
