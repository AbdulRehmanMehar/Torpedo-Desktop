import { AuthenticationResponse } from "../../../../config/types";

export enum ActionTypes {
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
}

interface AttemptLogin {
  type: ActionTypes.LOGIN;
  payload: AuthenticationResponse;
}

interface AttemptLogout {
  type: ActionTypes.LOGOUT;
}

export type Action = AttemptLogin | AttemptLogout;