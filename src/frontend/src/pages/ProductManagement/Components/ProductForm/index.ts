import { connect } from "react-redux";
import ProductForm from "./ProductForm";
import { RootState } from "../../../../store";
import withNavigation from "../../../../hoc/Navigation";
import { addProduct, updateProduct, getSingleProduct, getAllProducts } from "../../Store/Actions";

const mapStateToProps = (state: RootState) => {
  const { Product } = state;
  const { products, product } = Product;
  return {
    products,
    product
  };
};

const mapActionToProps = {
  getAllProducts,
  addProduct,
  getSingleProduct,
  updateProduct,
};

export default connect(mapStateToProps, mapActionToProps)(withNavigation(ProductForm));