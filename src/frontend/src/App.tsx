import { Component, Fragment } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Dashboard from "./layouts/Dashboard";

export default class App extends Component<any, any> {
  render() {
    return (
      <BrowserRouter>
        <Dashboard>
          <AppRoutes />
        </Dashboard>
      </BrowserRouter>
    )
  }
}