import { connect } from "react-redux";
import InvoiceForm from "./ProductForm";
import { RootState } from "../../../../store";
import withNavigation from "../../../../hoc/Navigation";

const mapStateToProps = (state: RootState) => {
  const { Invoice } = state;
  const { invoices } = Invoice;
  return {
    invoices
  };
};

const mapActionToProps = {};

export default connect(mapStateToProps, mapActionToProps)(withNavigation(InvoiceForm));