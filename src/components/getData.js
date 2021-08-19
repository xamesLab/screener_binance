import Binance from "binance-api-node";
import { conf } from "./conf";

export async function getData(currency, limit) {
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
    symbol: `${currency}USDT`,
    interval: "5m",
    limit: limit,
  });

  resp.forEach((i) => {
    data.columns.times.push(i.openTime);
    data.columns.low.push(+i.low);
    data.columns.high.push(+i.high);
  });
  return data;
}
