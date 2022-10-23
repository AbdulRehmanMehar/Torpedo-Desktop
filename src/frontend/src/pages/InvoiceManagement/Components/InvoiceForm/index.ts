import { connect } from "react-redux";
import InvoiceForm from "./InvoiceForm";
import { RootState } from "../../../../store";
import withNavigation from "../../../../hoc/Navigation";
import { getInvoices, addInvoice } from "../../Store/Actions";

const mapStateToProps = (state: RootState) => {
  const { Invoice } = state;
  const { invoices } = Invoice;
  return {
    invoices
  };
};

const mapActionToProps = {
  getInvoices,
  addInvoice,
};

export default connect(mapStateToProps, mapActionToProps)(withNavigation(InvoiceForm));