import { Component } from "react";
import { Provider } from "react-redux";
import { connect } from "react-redux";
import { RootState } from "./store";
import { HashRouter } from "react-router-dom";
import store from "./store";
import Bootstrap from "./Bootstrap";

export default class App extends Component<any, any> {
  render() {

    const { token } = this.props;

    return (
      <HashRouter>
        <Provider store={store}>
          <Bootstrap />
        </Provider>
      </HashRouter>
    )
  }
}

