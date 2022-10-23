import { connect } from "react-redux";
import { RootState } from "../../../../store";
import { getInvoices } from "../../Store/Actions";
import Invoice from "./Invoice";

const mapStateToProps = (state: RootState) => {
  const { Invoice } = state;
  const { invoices } = Invoice;
  return {
    invoices
  };
};

const mapActionToProps = {
  getInvoices
};

export default connect(mapStateToProps, mapActionToProps)(Invoice);