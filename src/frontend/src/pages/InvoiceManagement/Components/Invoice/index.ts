import { connect } from "react-redux";
import withNavigation from "../../../../hoc/Navigation";
import { RootState } from "../../../../store";
import { getInvoices } from "../../Store/Actions";
import Invoice from "./Invoice";

const mapStateToProps = (state: RootState) => {
  const { Invoice } = state;
  const { invoices, totalInvoices } = Invoice;
  return {
    invoices,
    totalInvoices
  };
};

const mapActionToProps = {
  getInvoices
};

export default connect(mapStateToProps, mapActionToProps)(withNavigation(Invoice));