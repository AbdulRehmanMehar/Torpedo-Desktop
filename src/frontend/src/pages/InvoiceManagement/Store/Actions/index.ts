import { Dispatch } from "@reduxjs/toolkit";
import { ActionArgs } from "../../../../config/types";
import { createInvoice, getInvoiceList } from "../../Helpers/httpMethods";
import { ActionTypes } from "./types";

export const getInvoices = (args: ActionArgs) => async (dispatch: Dispatch) => {

  const { data, onSuccess, onComplete, onError } = args || {};

  try {
    const { invoices, total } = await getInvoiceList(data);
    
    dispatch({
      type: ActionTypes.GET_INVOICES,
      payload: {
        invoices, 
        total
      }
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
  const { data, onSuccess, onComplete, onError } = args || {};
  console.log(data, 'addInvoice');
  
  try {
    const { invoice } = await createInvoice(data);
    console.log({ invoice });
    
    dispatch({
      type: ActionTypes.ADD_INVOICE,
      payload: invoice
    });

    onSuccess && onSuccess();
  } catch (error) {
    console.log(error);
    onError && onError(error);
  } finally {
    onComplete && onComplete();
  }
}