import { Invoice } from "../../../../config/types";
import { Action, ActionTypes } from "../Actions/types";

interface State {
  invoices: Invoice[];
}

const initalState: State = {
  invoices: [],
};

const invoiceReducer = (state = initalState, action: Action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch(action.type) {
    case ActionTypes.GET_INVOICES:      
      return {
        ...state,
        invoices: action.payload
      };
    
    default: 
      return state;
  }
};

export default invoiceReducer;