import Binance from "binance-api-node";
import { conf } from "./conf";

export async function getData(currency, timeFrame, limit) {
  // библиотека API Binance
  const client = Binance();
  // структура данных
  const data = {
    colors: { low: conf.colors.low, high: conf.colors.high },
    settings: {
      coin: currency,
      tF: timeFrame,
      limit: limit,
    },
    columns: {
      times: [],
      low: [],
      high: [],
      open: [],
      close: [],
    },
  };

  // запрос к серверу фьючерсов
  const resp = await client.futuresCandles({
    symbol: `${currency}USDT`,
    interval: timeFrame,
    limit: limit,
  });

  // заполнение структуры
  resp.forEach((v, i, arr) => {
    if (i !== arr.length - 1) {
      data.columns.times.push(v.openTime);
      data.columns.low.push(+v.low);
      data.columns.high.push(+v.high);
      data.columns.open.push(+v.open);
      data.columns.close.push(+v.close);
    }
  });
  return data;
}
