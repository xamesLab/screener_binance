const sizingReducer = (state = 0, action) => {
  switch (action.type) {
    case "STATE":
      return state + 1;
    default:
      return state;
  }
};

export default sizingReducer;
