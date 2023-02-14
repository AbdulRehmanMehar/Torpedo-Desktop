import { getLocalStorageWithExpiry, setLocalStorageWithExpiry } from "../../../../config/localstorage";
import { AuthenticatedTenant, AuthenticatedUser, Invoice } from "../../../../config/types";
import { Action, ActionTypes } from "../Actions/types";

interface State {
  token: string | undefined;
  user: AuthenticatedUser | undefined;
  tenant: AuthenticatedTenant | undefined;
}

const initalState: State = {
  token: undefined,
  user: undefined,
  tenant: undefined,
  ...getLocalStorageWithExpiry('auth')
};

const authenticationReducer = (state = initalState, action: Action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch(action.type) {
    case ActionTypes.LOGIN:    
      setLocalStorageWithExpiry('auth', action.payload, 86400);
      return {
        ...state,
        ...action.payload
      };
    
    default: 
      return state;
  }
};

export default authenticationReducer;