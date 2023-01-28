import React from "react";
import { Provider } from "react-redux";
import { store } from "./store/store";

export function rootContainer(root: any) {
  return <Provider store={store}>{root}</Provider>;
}
