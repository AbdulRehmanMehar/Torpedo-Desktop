import { connect } from "react-redux";
import withNavigation from "../../../../hoc/Navigation";
import { RootState } from "../../../../store";
import { getAllProducts } from "../../Store/Actions";
import ProductComponent from "./Product";

const mapStateToProps = (state: RootState) => {
  const { Product } = state;
  const { products, totalProducts } = Product;
  return {
    products,
    totalProducts
  };
};

const mapActionToProps = {
  getProducts: getAllProducts
};

export default connect(mapStateToProps, mapActionToProps)(withNavigation(ProductComponent));