import { AuthenticationResponse } from "../../../../config/types";

export enum ActionTypes {
  LOGIN = 'LOGIN',
}

interface AttemptLogin {
  type: ActionTypes.LOGIN;
  payload: AuthenticationResponse;
}

export type Action = AttemptLogin;