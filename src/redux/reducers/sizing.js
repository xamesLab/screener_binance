const sizingReducer = (state = 200, action) => {
  switch (action.type) {
    case "UP":
      return state + 10;
    case "DOWN":
      return state - 10;
    default:
      return state;
  }
};

export default sizingReducer;
