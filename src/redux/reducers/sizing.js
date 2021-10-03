const sizingReducer = (
  state = { size: { width: 350, height: 155 } },
  action
) => {
  switch (action.type) {
    case "WIDTH_LESS":
      return {
        size: { width: (state.size.width -= 10), height: state.size.height },
      };
    case "WIDTH_MORE":
      return {
        size: { width: (state.size.width += 10), height: state.size.height },
      };
    case "HEIGHT_LESS":
      return {
        size: { width: state.size.width, height: (state.size.height -= 10) },
      };
    case "HEIGHT_MORE":
      return {
        size: { width: state.size.width, height: (state.size.height += 10) },
      };
    default:
      return state;
  }
};

export default sizingReducer;
