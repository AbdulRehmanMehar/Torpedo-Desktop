import { Component } from "react";
import AppRoutes from "./AppRoutes";
import Dashboard from "./layouts/Dashboard";
import store, { RootState } from "./store";
import Login from "./pages/Authentication/Login";
import { connect } from "react-redux";
import { ToastContainer } from "react-toastify";
import withNavigation, { NavigationProps } from "./hoc/Navigation";


class Bootstrap extends Component<{ token: string | undefined; navigationProps: NavigationProps }, any> {
    componentDidMount(): void {
        const { navigationProps, token } = this.props;
        const { navigate } = navigationProps;
        if (!token) navigate('/login');
    }
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
  
  export default connect(mapStateToProps, {})(withNavigation(Bootstrap));