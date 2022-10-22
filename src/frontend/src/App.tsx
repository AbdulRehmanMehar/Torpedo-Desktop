import { Component } from "react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import Dashboard from "./layouts/Dashboard";
import store from "./store";

export default class App extends Component<any, any> {
  render() {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <Dashboard>
            <AppRoutes />
          </Dashboard>
        </Provider>
      </BrowserRouter>
    )
  }
}