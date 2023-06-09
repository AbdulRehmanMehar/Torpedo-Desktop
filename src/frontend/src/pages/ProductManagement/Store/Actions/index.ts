import { Dispatch } from "@reduxjs/toolkit";
import { ActionArgs } from "../../../../config/types";
import { listProducts, addProduct as createProduct, getProductById, updateTheProduct } from "../../Helpers/httpMethods";
// import { login as attemptLogin } from "../../Helpers/httpMethods";
import { ActionTypes } from "./types";

export const getAllProducts = (args: ActionArgs) => async (dispatch: Dispatch) => {
  const { data, onSuccess, onComplete, onError } = args || {};

  try {
    const { products, total } = await listProducts(data);
    
    dispatch({
      type: ActionTypes.LIST_PRODUCTS,
      payload: { products, total },
    })
    
    onSuccess && onSuccess();
  } catch (error: any) {
    console.log(error);
    const message = error.message  || error.response.data.error_description;
    onError && onError(message);
  } finally {
    onComplete && onComplete();
  }
}

export const addProduct = (args: ActionArgs) => async (dispatch: Dispatch) => {
  const { data, onSuccess, onComplete, onError } = args || {};

  try {
    const {product} = await createProduct(data);
    
    dispatch({
        type: ActionTypes.ADD_PRODUCT,
        payload: product,
    })
    
    onSuccess && onSuccess();
  } catch (error: any) {
    console.log(error);
    const message = error.message  || error.response.data.error_description;
    onError && onError(message);
  } finally {
    onComplete && onComplete();
  }
}

export const getSingleProduct = (args: ActionArgs) => async (dispatch: Dispatch) => {
  const { data, onSuccess, onComplete, onError } = args || {};

  try {
    const { product } = await getProductById(data.productId);
    
    dispatch({
      type: ActionTypes.GET_PRODUCT,
      payload: product,
    })
    
    onSuccess && onSuccess();
  } catch (error: any) {
    console.log(error);
    const message = error.message  || error.response.data.error_description;
    onError && onError(message);
  } finally {
    onComplete && onComplete();
  }
}

export const updateProduct = (args: ActionArgs) => async (dispatch: Dispatch) => {
  const { data, onSuccess, onComplete, onError } = args || {};

  try {
    const { product } = await updateTheProduct(data);   
    
    dispatch({
      type: ActionTypes.UPDATE_PRODUCT,
      payload: product,
    });
    
    onSuccess && onSuccess();
  } catch (error: any) {
    console.log(error);
    const message = error.message  || error.response.data.error_description;
    onError && onError(message);
  } finally {
    onComplete && onComplete();
  }
}