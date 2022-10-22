import { Dispatch } from "@reduxjs/toolkit";
import { ActionArgs } from "../../../../config/types";
import { createInvoice, getInvoiceList } from "../../Helpers/httpMethods";
import { ActionTypes } from "./types";

export const getInvoices = (args: ActionArgs) => async (dispatch: Dispatch) => {

  const { data, onSuccess, onComplete, onError } = args;

  try {
    const { invoices } = await getInvoiceList();
    
    dispatch({
      type: ActionTypes.GET_INVOICES,
      payload: invoices
    });

    onSuccess && onSuccess(invoices);

  } catch (error) {
    dispatch({
      type: ActionTypes.GET_INVOICES,
      payload: []
    });
    onError && onError(error);
  } finally {
    onComplete && onComplete();
  }
};

export const addInvoice = (args: ActionArgs) =>async (dispatch: Dispatch) => {
  const { data, onSuccess, onComplete, onError } = args;

  try {
    const { invoice } = await createInvoice(data);
    onSuccess && onSuccess();
  } catch (error) {
    console.log(error);
    onError && onError(error);
  } finally {
    onComplete && onComplete();
  }
}