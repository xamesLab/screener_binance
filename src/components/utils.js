import { conf } from "./conf";

const getCanvasContext = (canvas) => {
  canvas.width = conf.DPI_WIDTH;
  canvas.height = conf.DPI_HEIGHT;
  canvas.style.width = `${conf.WIDTH}px`;
  canvas.style.height = `${conf.HEIGHT}px`;
  return canvas.getContext("2d");
};

const getBoundaries = (data) => {
  let min;
  let max;

  for (const [, y] of data) {
    if (typeof min !== "number") min = y;
    if (typeof max !== "number") max = y;

    if (min > y) min = y;
    if (max < y) max = y;
  }

  return [min, max];
};

export const drawChart = (canvas, data) => {
  const ctx = getCanvasContext(canvas);

  const [yMin, yMax] = getBoundaries(data);
  const yRatio = conf.VIEW_HEIGHT / (yMax - yMin);

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

  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = "#ff0000";
  for (let [x, y] of data) {
    ctx.lineTo(x, conf.DPI_HEIGHT - y * yRatio - conf.PADDING);
  }
  ctx.stroke();
  ctx.closePath();
};
