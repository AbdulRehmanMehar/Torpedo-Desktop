import { connect } from "react-redux";
import ProductForm from "./ProductForm";
import { RootState } from "../../../../store";
import withNavigation from "../../../../hoc/Navigation";
import { addProduct, updateProduct, getSingleProduct, getAllProducts } from "../../Store/Actions";

const mapStateToProps = (state: RootState) => {
  const { Product, Suggestions } = state;
  const { products, product } = Product;
  const { suggestions } = Suggestions;
  return {
    products,
    product,
    suggestions: suggestions?.products
  };
};

const mapActionToProps = {
  addProduct,
  getSingleProduct,
  updateProduct,
};

export default connect(mapStateToProps, mapActionToProps)(withNavigation(ProductForm));