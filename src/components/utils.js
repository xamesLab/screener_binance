import { conf } from "./conf";

// инициализация канваса
const getCanvasContext = (canvas, h) => {
  canvas.width = conf.DPI_WIDTH;
  canvas.height = h * 2;
  canvas.style.width = `${conf.WIDTH}px`;
  canvas.style.height = `${h}px`;
  return canvas.getContext("2d");
};

// инициализация канваса
const getContextX = (canvas) => {
  canvas.width = conf.DPI_WIDTH;
  canvas.height = 60;
  canvas.style.width = `${conf.WIDTH}px`;
  canvas.style.height = `30px`; // высота временной шкалы
  return canvas.getContext("2d");
};

// инициализация канваса
const getContextY = (canvas, h) => {
  canvas.width = 110;
  canvas.height = h * 2;
  canvas.style.width = `55px`; // ширина ценовой шкалы
  canvas.style.height = `${h}px`;
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
  // отрисовка метки
  const printLabel = (tStep, text) => {
    ctx.fillText(text, tStep - 28, 32);
    ctx.moveTo(tStep, 0);
    ctx.lineTo(tStep, 10);
  };
  const step = (conf.DPI_WIDTH - 25) / times.length; // DPI между двумя соседними точками графика
  const timeStep = times[1] - times[0]; // мс между двумя соседними точками графика
  const timeRatio = timeStep / step; // "плотность" шкалы времени
  let countDate = 0;

  ctx.beginPath();
  ctx.strokeStyle = "#777";
  ctx.font = "normal 22px Helvetica, sans-serif";
  ctx.fillStyle = "#777";

  // выбор подходящей метки, в зависимости от плотности временной шкалы
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
const drawAxisY = (ctx, yMin, yMax, h) => {
  const step = (h * 2 - 30) / conf.ROWS_COUNT;
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
const drawChartField = (ctx, h) => {
  const step = (h * 2 - 30) / conf.ROWS_COUNT;

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
};

// отрисовка свечей
const drawCandles = (ctx, columns, colors, ratio, yMin, h) => {
  const xRatio = (conf.DPI_WIDTH - 25) / columns.open.length;

  // отрисовка от/до
  const _draw = (from, unto, index, h) => {
    ctx.moveTo(xRatio * index, h * 2 - from * ratio - conf.PADDING);
    ctx.lineTo(xRatio * index, h * 2 - unto * ratio - conf.PADDING);
  };

  for (let i in columns.open) {
    // дельта от нижней границы до величины цены
    // тело
    const yO = columns.open[i] - yMin;
    const yC = columns.close[i] - yMin;
    // тень
    const yL = columns.low[i] - yMin;
    const yH = columns.high[i] - yMin;

    ctx.beginPath();

    // цвет свечи
    if (columns.open[i] > columns.close[i]) {
      ctx.strokeStyle = colors.low;
    } else {
      ctx.strokeStyle = colors.high;
    }

    // отрисовка тела
    ctx.lineWidth = 9;
    _draw(yO, yC, i, h);
    ctx.stroke();

    // отрисовка тени
    ctx.lineWidth = 3;
    _draw(yL, yH, i, h);
    ctx.stroke();
  }
};

// координаты по принятым данным
const getCoord = (array, ratio, yMin, h) => {
  const coord = [];
  // шаг координат
  const xRatio = (conf.DPI_WIDTH - 40) / (array.length - 1);

  for (let i in array) {
    let y = array[i] - yMin;
    coord.push([i * xRatio, h * 2 - y * ratio - conf.PADDING]);
  }
  return coord;
};

export const canvasInit = (canvas, canvasY, canvasX, h) => {
  const ctx = getCanvasContext(canvas, h);
  const ctxY = getContextY(canvasY, h);
  const ctxX = getContextX(canvasX, h);
  return [ctx, ctxY, ctxX];
};

// финальная отрисовка графика и возврат параметров графика
export const drawChart = (
  ctxArray,
  { columns, colors },
  chartsType = "LINE",
  h
) => {
  const ctx = ctxArray[0];
  const ctxY = ctxArray[1];
  const ctxX = ctxArray[2];

  ctx.clearRect(0, 0, conf.DPI_WIDTH, h * 2);
  ctxY.clearRect(0, 0, conf.DPI_WIDTH, h * 2);
  ctxX.clearRect(0, 0, conf.DPI_WIDTH, h * 2);

  const [yMin, yMax] = getBoundaries(columns);
  drawChartField(ctx, h);
  drawAxisY(ctxY, yMin, yMax, h);
  drawAxisX(ctxX, columns);

  const yRatio = (h * 2 - 30) / (yMax - yMin);

  // линейный график
  if (chartsType === "LINE") {
    drawLine(ctx, getCoord(columns.high, yRatio, yMin, h), colors.high);
    drawLine(ctx, getCoord(columns.low, yRatio, yMin, h), colors.low);
  } else {
    // свечной график
    drawCandles(ctx, columns, colors, yRatio, yMin, h);
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
