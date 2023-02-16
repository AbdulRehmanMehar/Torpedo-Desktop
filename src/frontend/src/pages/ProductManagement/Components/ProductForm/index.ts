import { connect } from "react-redux";
import ProductForm from "./ProductForm";
import { RootState } from "../../../../store";
import withNavigation from "../../../../hoc/Navigation";
import { getAllProducts } from "../../Store/Actions";

const mapStateToProps = (state: RootState) => {
  const { Product } = state;
  const { products } = Product;
  return {
    products
  };
};

const mapActionToProps = {
  getAllProducts
};

export default connect(mapStateToProps, mapActionToProps)(withNavigation(ProductForm));