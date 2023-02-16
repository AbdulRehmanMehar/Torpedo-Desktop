import { connect } from "react-redux";
import ProductForm from "./ProductForm";
import { RootState } from "../../../../store";
import withNavigation from "../../../../hoc/Navigation";
import { getAllProducts } from "../../Store/Actions";

const mapStateToProps = (state: RootState) => {
  const { Invoice } = state;
  const { invoices } = Invoice;
  return {
    invoices
  };
};

const mapActionToProps = {
  getAllProducts
};

export default connect(mapStateToProps, mapActionToProps)(withNavigation(ProductForm));