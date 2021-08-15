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
    ctx.fillText(text, 1143, y + conf.PADDING + 5);
    ctx.moveTo(0, y + conf.PADDING);
    ctx.lineTo(conf.DPI_WIDTH - 60, y + conf.PADDING);
  }
  ctx.stroke();
  ctx.closePath();
};

const drawLine = (ctx, coord, color) => {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = color;

  coord.forEach((i) => {
    let [x, y] = i;
    ctx.lineTo(x, y);
  });

  ctx.stroke();
  ctx.closePath();
};

const getCoord = (array, ratio, yMin) => {
  const coord = [];
  const xRatio = (conf.DPI_WIDTH - 60) / array.length;
  console.log(array.length, (conf.DPI_WIDTH - 60) / array.length);
  for (let i in array) {
    let y = array[i] - yMin;
    coord.push([i * xRatio, conf.DPI_HEIGHT - y * ratio - conf.PADDING]);
  }
  return coord;
};

export const drawChart = (canvas, { colors, columns }) => {
  const ctx = getCanvasContext(canvas);
  const [yMin, yMax] = getBoundaries(columns);
  drawChartField(ctx, yMin, yMax);

  const yRatio = conf.VIEW_HEIGHT / (yMax - yMin);

  drawLine(ctx, getCoord(columns.high, yRatio, yMin), colors.high);
  drawLine(ctx, getCoord(columns.low, yRatio, yMin), colors.low);
};
