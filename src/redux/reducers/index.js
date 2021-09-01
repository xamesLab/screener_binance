import mainColorsReducer from "./mainColors";
import sizingReducer from "./sizing";
import typeChartReducer from "./typeChart";
import { combineReducers } from "redux";

const allReducers = combineReducers({
  sizing: sizingReducer,
  mainColors: mainColorsReducer,
  typeChart: typeChartReducer,
});

export default allReducers;
