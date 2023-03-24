import { connect } from "react-redux";
import InvoiceForm from "./InvoiceForm";
import { RootState } from "../../../../store";
import withNavigation from "../../../../hoc/Navigation";
import { getInvoices, addInvoice } from "../../Store/Actions";
import withForm from "../../../../hoc/AntForm";

const mapStateToProps = (state: RootState) => {
  const { Invoice, Suggestions } = state;
  const { invoices } = Invoice;
  const { suggestions } = Suggestions;
  return {
    suggestions: suggestions?.invoices
  };
};

const mapActionToProps = {
  getInvoices,
  addInvoice,
};


export default connect(mapStateToProps, mapActionToProps)(withNavigation(withForm(InvoiceForm)));