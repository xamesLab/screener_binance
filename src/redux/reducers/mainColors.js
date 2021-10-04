const mainColorsReducer = (
  state = { bull: "#098A00", bear: "#D50101" },
  action
) => {
  switch (action.type) {
    case "BEARCOLOR":
      return { bull: state.bull, bear: action.hex };
    case "BULLCOLOR":
      return { bull: action.hex, bear: state.bear };
    default:
      return state;
  }
};

export default mainColorsReducer;
