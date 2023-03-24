import { Dispatch } from "@reduxjs/toolkit";
import { ActionArgs } from "../../config/types";
import { fetchSuggestions } from "../httpMethods";
import { ActionTypes } from "./types";

export const getSuggestions = (args: ActionArgs) => async (dispatch: Dispatch) => {
  const { data, onSuccess, onComplete, onError } = args || {};

  try {
    const suggestions = await fetchSuggestions();
    
    dispatch({
      type: ActionTypes.GET_SUGGESTIONS,
      payload: suggestions,
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
