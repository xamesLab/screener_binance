import { conf } from "./conf";

const getCanvasContext = (canvas) => {
  canvas.width = conf.DPI_WIDTH;
  canvas.height = conf.DPI_HEIGHT;
  canvas.style.width = `${conf.WIDTH}px`;
  canvas.style.height = `${conf.HEIGHT}px`;
  return canvas.getContext("2d");
};

const getContextX = (canvas) => {
  canvas.width = conf.DPI_WIDTH;
  canvas.height = 60;
  canvas.style.width = `${conf.WIDTH}px`;
  canvas.style.height = `30px`;
  return canvas.getContext("2d");
};

const getContextY = (canvas) => {
  canvas.width = 110;
  canvas.height = conf.DPI_HEIGHT;
  canvas.style.width = `55px`;
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

const drawAxisX = (ctx, { times }) => {
  const step = conf.DPI_WIDTH / times.length;

  ctx.beginPath();
  ctx.strokeStyle = "#777";
  ctx.font = "normal 22px Helvetica, sans-serif";
  ctx.fillStyle = "#777";
  for (let i = 0; i < times.length; i++) {
    const x = step * i;
    let d = new Date(times[i]);
    if (d.getMinutes() === 0 || d.getMinutes() === 30) {
      const text = `${d.getHours()}:${
        d.getMinutes() === 0 ? "00" : d.getMinutes()
      }`;
      ctx.fillText(text, x - 28, 35);
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 10);
    }
  }
  ctx.stroke();
  ctx.closePath();
};

const drawAxisY = (ctx, yMin, yMax) => {
  const step = conf.VIEW_HEIGHT / conf.ROWS_COUNT;
  const textStep = (yMax - yMin) / conf.ROWS_COUNT;

  ctx.beginPath();
  ctx.strokeStyle = "#777";
  ctx.font = "normal 20px Helvetica, sans-serif";
  ctx.fillStyle = "#777";
  for (let i = 0; i <= conf.ROWS_COUNT; i++) {
    const y = step * i;
    const text = yMax - textStep * i;
    ctx.fillText(text.toFixed(2), 10, y + conf.PADDING + 5);
    ctx.moveTo(0, y + conf.PADDING);
    ctx.lineTo(7, y + conf.PADDING);
  }
  ctx.stroke();
  ctx.closePath();
};

const drawChartField = (ctx) => {
  const step = conf.VIEW_HEIGHT / conf.ROWS_COUNT;

  ctx.beginPath();
  ctx.strokeStyle = "#777";
  for (let i = 0; i <= conf.ROWS_COUNT; i++) {
    const y = step * i;
    ctx.moveTo(0, y + conf.PADDING + 0.5);
    ctx.lineTo(conf.DPI_WIDTH, y + conf.PADDING);
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
  const xRatio = conf.DPI_WIDTH / array.length;
  for (let i in array) {
    let y = array[i] - yMin;
    coord.push([i * xRatio, conf.DPI_HEIGHT - y * ratio - conf.PADDING]);
  }
  return coord;
};

export const drawChart = (canvas, canvasY, canvasX, { colors, columns }) => {
  const ctx = getCanvasContext(canvas);
  const ctxY = getContextY(canvasY);
  const ctxX = getContextX(canvasX);
  const [yMin, yMax] = getBoundaries(columns);
  drawChartField(ctx);
  drawAxisY(ctxY, yMin, yMax);
  drawAxisX(ctxX, columns);

  const yRatio = conf.VIEW_HEIGHT / (yMax - yMin);

  drawLine(ctx, getCoord(columns.high, yRatio, yMin), colors.high);
  drawLine(ctx, getCoord(columns.low, yRatio, yMin), colors.low);
};

export const drawOverlay = (canvas) => {
  const ctx = getCanvasContext(canvas);

  const mousemove = (e) => {
    ctx.beginPath();
    ctx.clearRect(0, 0, conf.DPI_WIDTH, conf.DPI_HEIGHT);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgb(74, 0, 97)";

    ctx.setLineDash([5, 10]);

    ctx.moveTo(e.layerX * 2, 0);
    ctx.lineTo(e.layerX * 2, conf.DPI_HEIGHT);

    ctx.moveTo(-1, e.layerY * 2);
    ctx.lineTo(conf.DPI_WIDTH, e.layerY * 2);

    ctx.stroke();
    ctx.closePath();
  };

  const mouseout = () => {
    ctx.clearRect(0, 0, conf.DPI_WIDTH, conf.DPI_HEIGHT);
  };

  canvas.addEventListener("mousemove", mousemove);
  canvas.addEventListener("mouseout", mouseout);

  return {
    destroy() {
      canvas.removeEventListener("mousemove", mousemove);
      canvas.removeEventListener("mouseout", mouseout);
    },
  };
};
