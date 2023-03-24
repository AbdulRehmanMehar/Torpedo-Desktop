import { AUTH_STORE_KEY } from "../../../../config/constants";
import { getLocalStorageWithExpiry, removeLocalStorage, setLocalStorageWithExpiry } from "../../../../config/localstorage";
import { AuthenticatedTenant, AuthenticatedUser, Invoice } from "../../../../config/types";
import { Action, ActionTypes } from "../Actions/types";

interface State {
  token: string | undefined;
  user: AuthenticatedUser | undefined;
  tenant: AuthenticatedTenant | undefined;
}

export type AuthenticationStore = State;

const initalState: State = {
  token: undefined,
  user: undefined,
  tenant: undefined,
  ...getLocalStorageWithExpiry(AUTH_STORE_KEY)
};

const authenticationReducer = (state = initalState, action: Action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch(action.type) {
    case ActionTypes.LOGIN:    
      setLocalStorageWithExpiry(AUTH_STORE_KEY, action.payload, 86400);
      return {
        ...state,
        ...action.payload
      };
    
    case ActionTypes.LOGOUT:
      removeLocalStorage(AUTH_STORE_KEY);
      return initalState;
    
    default: 
      return state;
  }
};

export default authenticationReducer;