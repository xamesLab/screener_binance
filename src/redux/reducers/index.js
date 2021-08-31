import mainColorsReducer from "./mainColors";
import sizingReducer from "./sizing";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  sizing: sizingReducer,
  mainColors: mainColorsReducer,
});

export default allReducers;
