import { ProductResponse } from "../../../../config/types";
import { Action, ActionTypes } from "../Actions/types";

interface State {
  products: ProductResponse[],
  totalProducts: number;
}

export type ProductStore = State;

const initalState: State = {
  products: [],
  totalProducts: 0,
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
    
    
    default: 
      return state;
  }
};

export default productsReducer;