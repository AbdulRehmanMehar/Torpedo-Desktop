import { AuthenticationResponse, ProductResponse } from "../../../../config/types";

export enum ActionTypes {
  ADD_PRODUCT = 'ADD_PRODUCT',
  LIST_PRODUCTS = 'LIST_PRODUCTS',
}

interface AddProduct {
  type: ActionTypes.ADD_PRODUCT;
  payload: AuthenticationResponse;
}

interface ListProducts {
  type: ActionTypes.LIST_PRODUCTS;
  payload: {
    products: ProductResponse[],
    total: number;
  };
}


export type Action = AddProduct | ListProducts;