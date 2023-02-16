import { Dispatch } from "@reduxjs/toolkit";
import { ActionArgs } from "../../../../config/types";
import { listProducts } from "../../Helpers/httpMethods";
// import { login as attemptLogin } from "../../Helpers/httpMethods";
import { ActionTypes } from "./types";

export const getAllProducts = (args: ActionArgs) => async (dispatch: Dispatch) => {
  const { data, onSuccess, onComplete, onError } = args || {};

  try {
    const { products } = await listProducts();
    
    dispatch({
        type: ActionTypes.LIST_PRODUCTS,
        payload: products,
    })
    
    onSuccess && onSuccess();
  } catch (error: any) {
    console.log(error);
    const message = error.response.data.error_description;
    onError && onError(message);
  } finally {
    onComplete && onComplete();
  }
}
