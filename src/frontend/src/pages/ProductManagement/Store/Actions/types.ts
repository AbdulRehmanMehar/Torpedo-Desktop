import { AuthenticationResponse, ProductResponse } from "../../../../config/types";

export enum ActionTypes {
  ADD_PRODUCT = 'ADD_PRODUCT',
  GET_PRODUCT = 'GET_PRODUCT',
  LIST_PRODUCTS = 'LIST_PRODUCTS',
  UPDATE_PRODUCT = 'UPDATE_PRODUCT',
}

interface AddProduct {
  type: ActionTypes.ADD_PRODUCT;
  payload: AuthenticationResponse;
}

interface GetProduct {
  type: ActionTypes.GET_PRODUCT;
  payload: ProductResponse;
}

interface ListProducts {
  type: ActionTypes.LIST_PRODUCTS;
  payload: {
    products: ProductResponse[],
    total: number;
  };
}

interface UpdateProduct {
  type: ActionTypes.UPDATE_PRODUCT;
  payload: ProductResponse;
}

export type Action = AddProduct | ListProducts | GetProduct | UpdateProduct;