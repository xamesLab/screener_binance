import { conf } from "./conf";

// инициализация канваса
const getCanvasContext = (canvas, { width, height }) => {
  canvas.width = width * 2;
  canvas.height = height * 2;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  return canvas.getContext("2d");
};

// инициализация канваса
const getContextX = (canvas, { width }) => {
  canvas.width = width * 2;
  canvas.height = 60;
  canvas.style.width = `${width}px`;
  canvas.style.height = `30px`; // высота временной шкалы
  return canvas.getContext("2d");
};

// инициализация канваса
const getContextY = (canvas, { height }) => {
  canvas.width = 110;
  canvas.height = height * 2;
  canvas.style.width = `55px`; // ширина ценовой шкалы
  canvas.style.height = `${height}px`;
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
const drawAxisX = (ctx, { times }, width) => {
  // отрисовка метки
  const printLabel = (tStep, text) => {
    ctx.fillText(text, tStep - 28, 32);
    ctx.moveTo(tStep, 0);
    ctx.lineTo(tStep, 10);
  };
  const step = (width * 2 - 25) / times.length; // DPI между двумя соседними точками графика
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
const drawAxisY = (ctx, yMin, yMax, height) => {
  const step = (height * 2 - 30) / conf.ROWS_COUNT;
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
const drawChartField = (ctx, { height, width }) => {
  const step = (height * 2 - 30) / conf.ROWS_COUNT;

  ctx.beginPath();
  ctx.lineWidth = 1;
  ctx.strokeStyle = "#777";
  for (let i = 0; i <= conf.ROWS_COUNT; i++) {
    const y = step * i;
    ctx.moveTo(0, y + conf.PADDING + 0.5);
    ctx.lineTo(width * 2, y + conf.PADDING);
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
const drawCandles = (ctx, columns, colors, ratio, yMin, { width, height }) => {
  const xRatio = (width * 2 - 25) / columns.open.length;

  // отрисовка от/до
  const _draw = (from, unto, index) => {
    ctx.moveTo(xRatio * index, height * 2 - from * ratio - conf.PADDING);
    ctx.lineTo(xRatio * index, height * 2 - unto * ratio - conf.PADDING);
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
    _draw(yO, yC, i);
    ctx.stroke();

    // отрисовка тени
    ctx.lineWidth = 3;
    _draw(yL, yH, i);
    ctx.stroke();
  }
};

// координаты по принятым данным
const getCoord = (array, ratio, yMin, { height, width }) => {
  const coord = [];
  // шаг координат
  const xRatio = (width * 2 - 40) / (array.length - 1);

  for (let i in array) {
    let y = array[i] - yMin;
    coord.push([i * xRatio, height * 2 - y * ratio - conf.PADDING]);
  }
  return coord;
};

export const canvasInit = (canvas, canvasY, canvasX, size) => {
  const ctx = getCanvasContext(canvas, size);
  const ctxY = getContextY(canvasY, size);
  const ctxX = getContextX(canvasX, size);
  return [ctx, ctxY, ctxX];
};

// финальная отрисовка графика и возврат параметров графика
export const drawChart = (
  ctxArray,
  { columns, colors },
  chartsType = "LINE",
  size
) => {
  const { width, height } = size;
  const ctx = ctxArray[0];
  const ctxY = ctxArray[1];
  const ctxX = ctxArray[2];

  ctx.clearRect(0, 0, width * 2, height * 2);
  ctxY.clearRect(0, 0, width * 2, height * 2);
  ctxX.clearRect(0, 0, width * 2, height * 2);

  const [yMin, yMax] = getBoundaries(columns);
  drawChartField(ctx, size);
  drawAxisY(ctxY, yMin, yMax, height);
  drawAxisX(ctxX, columns, width);

  const yRatio = (height * 2 - 30) / (yMax - yMin);

  // линейный график
  if (chartsType === "LINE") {
    drawLine(ctx, getCoord(columns.high, yRatio, yMin, size), colors.high);
    drawLine(ctx, getCoord(columns.low, yRatio, yMin, size), colors.low);
  } else {
    // свечной график
    drawCandles(ctx, columns, colors, yRatio, yMin, size);
  }

  return { ratio: yRatio, min: yMin, max: yMax };
};

// верхний слой для интерактивности
export const drawOverlay = (canvas, { width, height }) => {
  const ctx = getCanvasContext(canvas, { width, height });

  const mousemove = (e) => {
    ctx.beginPath();
    ctx.clearRect(0, 0, width * 2, height * 2);
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgb(74, 0, 97)";

    ctx.setLineDash([5, 10]);

    ctx.moveTo(e.layerX * 2, 0);
    ctx.lineTo(e.layerX * 2, height * 2);

    ctx.moveTo(-1, e.layerY * 2);
    ctx.lineTo(width * 2, e.layerY * 2);

    ctx.stroke();
    ctx.closePath();
  };

  const mouseout = () => {
    ctx.clearRect(0, 0, width * 2, height * 2);
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
