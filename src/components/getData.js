import Binance from "binance-api-node";
import { conf } from "./conf";

export async function getData(currency, timeFrame, limit) {
  // библиотека API Binance
  const client = Binance();
  const data = {
    colors: { low: conf.colors.low, high: conf.colors.high },
    columns: {
      times: [],
      low: [],
      high: [],
    },
  };

  // запрос к серверу фьючерсов
  const resp = await client.futuresCandles({
    symbol: `${currency}USDT`,
    interval: timeFrame,
    limit: limit,
  });

  // формирование структуры
  resp.forEach((i) => {
    data.columns.times.push(i.openTime);
    data.columns.low.push(+i.low);
    data.columns.high.push(+i.high);
  });
  return data;
}
