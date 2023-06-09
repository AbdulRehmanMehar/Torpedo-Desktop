import { ProductResponse } from "../../../../config/types";
import { Action, ActionTypes } from "../Actions/types";

interface State {
  products: ProductResponse[],
  totalProducts: number;
  product?: ProductResponse;
}

export type ProductStore = State;

const initalState: State = {
  products: [],
  totalProducts: 0,
  product: undefined
};

const productsReducer = (state = initalState, action: Action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch(action.type) {
    case ActionTypes.LIST_PRODUCTS:    
      return {
        ...state,
        products: action.payload.products,
        totalProducts: action.payload.total
      }
    
    case ActionTypes.GET_PRODUCT:    
      return {
        ...state,
        product: action.payload,
      }
    
    case ActionTypes.UPDATE_PRODUCT:    
      return {
        ...state,
        products: [...state.products.filter(product => product.id !== action.payload.id), action.payload],
      }
    
    case ActionTypes.ADD_PRODUCT: 
      return {
        ...state,
        products: [...state.products, action.payload],
        totalProducts: state.totalProducts + 1,
      }

    default: 
      return state;
  }
};

export default productsReducer;