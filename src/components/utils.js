import Binance from "binance-api-node";
import { conf } from "./conf";

const getCanvasContext = (canvas) => {
  canvas.width = conf.DPI_WIDTH;
  canvas.height = conf.DPI_HEIGHT;
  canvas.style.width = `${conf.WIDTH}px`;
  canvas.style.height = `${conf.HEIGHT}px`;
  return canvas.getContext("2d");
};

const getBoundaries = ({ low, high }) => {
  let min = low[0];
  let max = high[0];
  for (let i in low) {
    if (min > low[i]) min = low[i];
    if (max < high[i]) max = high[i];
  }
  return [min, max];
};

const drawChartField = (ctx, yMin, yMax) => {
  const step = conf.VIEW_HEIGHT / conf.ROWS_COUNT;
  const textStep = (yMax - yMin) / conf.ROWS_COUNT;

  ctx.beginPath();
  ctx.strokeStyle = "#777";
  ctx.font = "normal 20px Helvetica, sans-serif";
  ctx.fillStyle = "#777";
  for (let i = 0; i <= conf.ROWS_COUNT; i++) {
    const y = step * i;
    const text = yMax - textStep * i;
    ctx.fillText(text, 1160, y + conf.PADDING + 5);
    ctx.moveTo(0, y + conf.PADDING);
    ctx.lineTo(conf.DPI_WIDTH - 50, y + conf.PADDING);
  }
  ctx.stroke();
  ctx.closePath();
};

// const drawLine = (ctx) => {
//   ctx.beginPath();
//   ctx.lineWidth = 3;
//   ctx.strokeStyle = "#ff0000";

//   ctx.stroke();
//   ctx.closePath();
// };

export const drawChart = (canvas, { colors, columns }) => {
  const ctx = getCanvasContext(canvas);
  const [yMin, yMax] = getBoundaries(columns);
  drawChartField(ctx, yMin, yMax);

  const yRatio = conf.VIEW_HEIGHT / (yMax - yMin);

  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "green";
  for (let i in columns.high) {
    let y = columns.high[i] - yMin;
    ctx.lineTo(i * 10, conf.DPI_HEIGHT - y * yRatio - conf.PADDING);
    console.log(+i * 10, conf.DPI_HEIGHT - y * yRatio - conf.PADDING);
  }
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#ff0000";
  for (let i in columns.low) {
    let y = columns.low[i] - yMin;
    ctx.lineTo(i * 10, conf.DPI_HEIGHT - y * yRatio - conf.PADDING);
    console.log(+i * 10, conf.DPI_HEIGHT - y * yRatio - conf.PADDING);
  }
  ctx.stroke();
  ctx.closePath();
};

export async function getData() {
  const client = Binance();
  const data = {
    colors: { low: "red", high: "green" },
    columns: {
      times: [],
      low: [],
      high: [],
    },
  };

  const resp = await client.futuresCandles({
    symbol: "BTCUSDT",
    interval: "1h",
    limit: 100,
  });

  resp.forEach((i) => {
    data.columns.times.push(i.openTime);
    data.columns.low.push(+i.low);
    data.columns.high.push(+i.high);
  });
  return data;
}
