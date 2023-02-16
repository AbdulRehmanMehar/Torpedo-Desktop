import { connect } from "react-redux";
import { RootState } from "../../../../store";
import { getAllProducts } from "../../Store/Actions";
import ProductComponent from "./Product";

const mapStateToProps = (state: RootState) => {
  const { Product } = state;
  const { products } = Product;
  return {
    products
  };
};

const mapActionToProps = {
  getProducts: getAllProducts
};

export default connect(mapStateToProps, mapActionToProps)(ProductComponent);