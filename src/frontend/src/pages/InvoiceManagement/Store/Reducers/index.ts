import { Invoice } from "../../../../config/types";
import { Action, ActionTypes } from "../Actions/types";

interface State {
  invoices: Invoice[];
  totalInvoices: number;
}

const initalState: State = {
  invoices: [],
  totalInvoices: 0,
};

const invoiceReducer = (state = initalState, action: Action) => {
  // eslint-disable-next-line sonarjs/no-small-switch
  switch(action.type) {
    case ActionTypes.GET_INVOICES:      
      return {
        ...state,
        invoices: action.payload.invoices,
        totalInvoices: action.payload.total,
      };

    case ActionTypes.ADD_INVOICE:      
      return {
        ...state,
        invoices: [...state.invoices, action.payload],
        totalInvoices: state.totalInvoices + 1
      };
    
    default: 
      return state;
  }
};

export default invoiceReducer;