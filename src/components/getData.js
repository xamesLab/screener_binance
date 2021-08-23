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

  // формирование структуры
  resp.forEach((i) => {
    data.columns.times.push(i.openTime);
    data.columns.low.push(+i.low);
    data.columns.high.push(+i.high);
    data.columns.open.push(+i.open);
    data.columns.close.push(+i.close);
  });
  return data;
}
