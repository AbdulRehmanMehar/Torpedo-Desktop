import { connect } from "react-redux";
import ProductForm from "./ProductForm";
import { RootState } from "../../../../store";
import withNavigation from "../../../../hoc/Navigation";
import { addProduct, getAllProducts } from "../../Store/Actions";

const mapStateToProps = (state: RootState) => {
  const { Product } = state;
  const { products } = Product;
  return {
    products
  };
};

const mapActionToProps = {
  getAllProducts,
  addProduct
};

export default connect(mapStateToProps, mapActionToProps)(withNavigation(ProductForm));