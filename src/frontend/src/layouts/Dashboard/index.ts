import Dashboard from "./Dashboard";
import withNavigation from '../../hoc/Navigation';
import { connect } from "react-redux";
import { RootState } from "../../store";
import { logout } from "../../pages/Authentication/Store/Actions";
import { getSuggestions } from "../../store/Actions";

const mapStateToProps = (state: RootState) => {
    const { Authentication } = state;
    return {
      authentication: Authentication,
    };
  };
  

export default connect(mapStateToProps, {
  logout,
  getSuggestions
})(withNavigation(Dashboard));