import { conf } from "./conf";

// инициализация канваса
const getCanvasContext = (canvas) => {
  canvas.width = conf.DPI_WIDTH;
  canvas.height = conf.DPI_HEIGHT;
  canvas.style.width = `${conf.WIDTH}px`;
  canvas.style.height = `${conf.HEIGHT}px`;
  return canvas.getContext("2d");
};

// инициализация канваса
const getContextX = (canvas) => {
  canvas.width = conf.DPI_WIDTH;
  canvas.height = 60;
  canvas.style.width = `${conf.WIDTH}px`;
  canvas.style.height = `30px`;
  return canvas.getContext("2d");
};

// инициализация канваса
const getContextY = (canvas) => {
  canvas.width = 110;
  canvas.height = conf.DPI_HEIGHT;
  canvas.style.width = `55px`;
  canvas.style.height = `${conf.HEIGHT}px`;
  return canvas.getContext("2d");
};

// определение границ графика по вертикали
const getBoundaries = ({ low, high }) => {
  let min = low[0];
  let max = high[0];
  for (let i in low) {
    if (min > low[i]) min = low[i];
    if (max < high[i]) max = high[i];
  }
  return [min, max];
};

// отрисовка временной шкалы
const drawAxisX = (ctx, { times }) => {
  const printLabel = (tStep, text) => {
    ctx.fillText(text, tStep - 28, 32);
    ctx.moveTo(tStep, 0);
    ctx.lineTo(tStep, 10);
  };
  const step = (conf.DPI_WIDTH - 25) / times.length;
  const timeStep = times[1] - times[0];
  const timeRatio = timeStep / step;
  let countDate = 0;

  ctx.beginPath();
  ctx.strokeStyle = "#777";
  ctx.font = "normal 22px Helvetica, sans-serif";
  ctx.fillStyle = "#777";

  for (let i = 0; i < times.length; i++) {
    const d = new Date(times[i]);
    const day = d.getDate();
    const hours = d.getHours();
    const mins = d.getMinutes();
    const month = d.getMonth() + 1;
    const monthLbl = month / 10 >= 1 ? month : "0" + month;
    const yearLbl = d.getFullYear().toString().slice(2, 4);

    if (timeRatio < 28000) {
      if (mins === 0 || mins === 30) {
        printLabel(step * i, `${hours}:${mins === 0 ? "00" : mins}`);
      }
    } else if (timeRatio < 55000) {
      if (mins === 0) {
        printLabel(step * i, `${hours}:00`);
      }
    } else if (timeRatio < 110000) {
      if (mins === 0 && hours % 2 === 1) {
        printLabel(step * i, `${hours}:00`);
      }
    } else if (timeRatio < 165000) {
      if (mins === 0 && hours % 3 === 0) {
        printLabel(step * i, `${hours}:00`);
      }
    } else if (timeRatio < 305000) {
      if (
        mins === 0 &&
        (hours === 3 || hours === 9 || hours === 15 || hours === 21)
      ) {
        printLabel(step * i, `${hours}:00`);
      }
    } else if (timeRatio < 650000) {
      if (hours === 3 || hours === 15) {
        printLabel(step * i, `${hours}:00`);
      }
    } else if (timeRatio < 1200000) {
      if (hours === 3) {
        printLabel(step * i, `${day}.${monthLbl}`);
      }
    } else if (timeRatio < 3500000 && hours === 3) {
      if (day % 3 === 0) {
        printLabel(step * i, `${day}.${monthLbl}`);
      }
    } else if (timeStep === 86400000 || timeStep === 43200000) {
      if (day === 1 && hours === 3) {
        printLabel(step * i, `${day}.${monthLbl}`);
      }
    } else if (timeStep === 259200000 || timeStep === 604800000) {
      if (month % 2 === 0 && day < countDate) {
        countDate = 0;
        printLabel(step * i, `${day}.${monthLbl}.${yearLbl}`);
      } else {
        countDate = day;
      }
    } else if (month % 6 === 0) {
      printLabel(step * i, `${day}.${monthLbl}.${yearLbl}`);
    }
  }
  ctx.stroke();
  ctx.closePath();
};

// отрисовка ценовой шкалы
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

// отрисовка поля графика
const drawChartField = (ctx) => {
  const step = conf.VIEW_HEIGHT / conf.ROWS_COUNT;

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#777";
  for (let i = 0; i <= conf.ROWS_COUNT; i++) {
    const y = step * i;
    ctx.moveTo(0, y + conf.PADDING + 0.5);
    ctx.lineTo(conf.DPI_WIDTH, y + conf.PADDING);
  }
  ctx.stroke();
  ctx.closePath();
};

// отрисовка линии по координатам с определенным цветом
const drawLine = (ctx, coord, color) => {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = color;

  coord.forEach((v) => {
    let [x, y] = v;
    ctx.lineTo(x, y);
  });

  ctx.stroke();
  ctx.closePath();
};

// отрисовка свечей
const drawCandles = (ctx, columns, colors, ratio, yMin) => {
  const xRatio = (conf.DPI_WIDTH - 25) / columns.open.length;

  for (let i in columns.open) {
    let yO = columns.open[i] - yMin;
    let yC = columns.close[i] - yMin;
    let yL = columns.low[i] - yMin;
    let yH = columns.high[i] - yMin;
    ctx.beginPath();
    ctx.lineWidth = 9;

    if (columns.open[i] > columns.close[i]) {
      ctx.strokeStyle = colors.low;
    } else {
      ctx.strokeStyle = colors.high;
    }
    ctx.moveTo(xRatio * i, conf.DPI_HEIGHT - yO * ratio - conf.PADDING);
    ctx.lineTo(xRatio * i, conf.DPI_HEIGHT - yC * ratio - conf.PADDING);
    ctx.stroke();

    ctx.lineWidth = 3;
    ctx.moveTo(xRatio * i, conf.DPI_HEIGHT - yL * ratio - conf.PADDING);
    ctx.lineTo(xRatio * i, conf.DPI_HEIGHT - yH * ratio - conf.PADDING);
    ctx.stroke();
  }

  ctx.closePath();
};

// координаты по принятым данным
const getCoord = (array, ratio, yMin) => {
  const coord = [];
  // шаг координат
  const xRatio = (conf.DPI_WIDTH - 40) / (array.length - 1);

  for (let i in array) {
    let y = array[i] - yMin;
    coord.push([i * xRatio, conf.DPI_HEIGHT - y * ratio - conf.PADDING]);
  }
  return coord;
};

export const canvasInit = (canvas, canvasY, canvasX) => {
  const ctx = getCanvasContext(canvas);
  const ctxY = getContextY(canvasY);
  const ctxX = getContextX(canvasX);
  return [ctx, ctxY, ctxX];
};

// финальная отрисовка графика и возврат параметров графика
export const drawChart = (
  ctxArray,
  { columns, colors },
  chartsType = "LINE"
) => {
  const ctx = ctxArray[0];
  const ctxY = ctxArray[1];
  const ctxX = ctxArray[2];

  ctx.clearRect(0, 0, conf.DPI_WIDTH, conf.DPI_HEIGHT);
  ctxY.clearRect(0, 0, conf.DPI_WIDTH, conf.DPI_HEIGHT);
  ctxX.clearRect(0, 0, conf.DPI_WIDTH, conf.DPI_HEIGHT);

  const [yMin, yMax] = getBoundaries(columns);
  drawChartField(ctx);
  drawAxisY(ctxY, yMin, yMax);
  drawAxisX(ctxX, columns);

  const yRatio = conf.VIEW_HEIGHT / (yMax - yMin);

  // линейный график
  if (chartsType === "LINE") {
    drawLine(ctx, getCoord(columns.high, yRatio, yMin), colors.high);
    drawLine(ctx, getCoord(columns.low, yRatio, yMin), colors.low);
  } else {
    // свечной график
    drawCandles(ctx, columns, colors, yRatio, yMin);
  }

  return { ratio: yRatio, min: yMin, max: yMax };
};

// верхний слой для интерактивности
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

export const updateData = (d, newData) => {
  let dt = { colors: d.colors, settings: d.settings, columns: {} };
  for (let i in d.columns) {
    let nd = [...d.columns[i]];
    nd.push(newData[i]);
    nd.shift();
    dt.columns[i] = nd;
  }
  return dt;
};
