import { Dispatch } from "@reduxjs/toolkit";
import { ActionArgs } from "../../../../config/types";
import { login as attemptLogin } from "../../Helpers/httpMethods";
import { ActionTypes } from "./types";

export const login = (args: ActionArgs) =>async (dispatch: Dispatch) => {
  const { data, onSuccess, onComplete, onError } = args || {};

  try {
    const resp = await attemptLogin(data);

    console.log(resp);
    
    dispatch({
        type: ActionTypes.LOGIN,
        payload: resp,
    });

    onSuccess && onSuccess();
  } catch (error: any) {
    console.log(error);
    const message = error.response.data.error_description;
    onError && onError(message);
  } finally {
    onComplete && onComplete();
  }
}