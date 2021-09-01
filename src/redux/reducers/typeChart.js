const typeChartReducer = (state = "CANDLE", action) => {
  switch (action.type) {
    case "SET_LINE":
      return "LINE";
    case "SET_CANDLE":
      return "CANDLE";
    default:
      return state;
  }
};

export default typeChartReducer;
