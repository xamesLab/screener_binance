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

export const sizeUP = () => {
  return {
    type: "UP",
  };
};

export const sizeDOWN = () => {
  return {
    type: "DOWN",
  };
};
