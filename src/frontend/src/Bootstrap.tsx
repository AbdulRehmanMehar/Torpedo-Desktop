import { Component } from "react";
import AppRoutes from "./AppRoutes";
import Dashboard from "./layouts/Dashboard";
import store, { RootState } from "./store";
import Login from "./pages/Authentication/Login";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";


class Bootstrap extends Component<{ token: string }, any> {
    render() {
        const { token } = this.props;
        return (
            <>
                {
                    token ? (
                        <Dashboard>
                            <AppRoutes />
                        </Dashboard>
                    ): <Login />
                }
                <ToastContainer />
          </>
        );
    }
}


const mapStateToProps = (state: RootState) => {
    const { Authentication } = state;
    const { token } = Authentication;
    return {
      token
    };
  };
  
  export default connect(mapStateToProps, {})(Bootstrap);