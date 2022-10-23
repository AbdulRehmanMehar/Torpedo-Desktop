import { Invoice } from "../../Helpers/types";

export enum ActionTypes {
  GET_INVOICES = 'GET_INVOICES',
}

interface GetInvoices {
  type: ActionTypes.GET_INVOICES;
  payload: Invoice[];
}

export type Action = GetInvoices;