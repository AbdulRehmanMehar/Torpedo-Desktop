import { Component, Fragment } from "react";
import AppRoutes from "./AppRoutes";
import Dashboard from "./layouts/Dashboard";

export default class App extends Component<any, any> {
  render() {
    return (
      <Fragment>
        <AppRoutes />
      </Fragment>
    )
  }
}