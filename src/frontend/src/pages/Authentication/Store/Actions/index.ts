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
  } catch (error) {
    console.log(error);
    onError && onError(error);
  } finally {
    onComplete && onComplete();
  }
}