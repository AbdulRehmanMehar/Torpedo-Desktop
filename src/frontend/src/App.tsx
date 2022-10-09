import { Component, Fragment } from "react";
import Dashboard from "./layouts/Dashboard";

export default class App extends Component<any, any> {
  render() {
    return (
      <Fragment>
        <Dashboard />
      </Fragment>
    )
  }
}