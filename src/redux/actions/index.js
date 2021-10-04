export const toggleColor = () => {
  return {
    type: "INVERT",
  };
};

export const setLine = () => {
  return {
    type: "SET_LINE",
  };
};

export const setCandle = () => {
  return {
    type: "SET_CANDLE",
  };
};

export const widthMore = () => {
  return {
    type: "WIDTH_MORE",
  };
};

export const widthLess = () => {
  return {
    type: "WIDTH_LESS",
  };
};

export const heightMore = () => {
  return {
    type: "HEIGHT_MORE",
  };
};

export const heightLess = () => {
  return {
    type: "HEIGHT_LESS",
  };
};

export const colorBull = (hex) => {
  return {
    type: "BULLCOLOR",
    hex: hex,
  };
};

export const colorBear = (hex) => {
  return {
    type: "BEARCOLOR",
    hex: hex,
  };
};
