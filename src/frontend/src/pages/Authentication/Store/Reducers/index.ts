import { Invoice } from "../../../../config/types";
import { Action, ActionTypes } from "../Actions/types";

interface State {
  token: string | undefined;
}

const initalState: State = {
  token: undefined,
};

const authenticationReducer = (state = initalState, action: Action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch(action.type) {
    case ActionTypes.LOGIN:      
      return {
        ...state,
        token: action.payload
      };
    
    default: 
      return state;
  }
};

export default authenticationReducer;