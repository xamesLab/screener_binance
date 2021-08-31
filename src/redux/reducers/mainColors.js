const mainColorsReducer = (state = { bull: "green", bear: "red" }, action) => {
  switch (action.type) {
    case "NORMAL":
      return state;
    case "INVERT":
      return { bull: "red", bear: "green" };
    default:
      return state;
  }
};

export default mainColorsReducer;
