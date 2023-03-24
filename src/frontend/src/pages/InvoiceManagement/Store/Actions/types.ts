import { Invoice, InvoiceListResponse } from "../../Helpers/types";

export enum ActionTypes {
  GET_INVOICES = 'GET_INVOICES',
  ADD_INVOICE = 'ADD_INVOICE',
}

interface GetInvoices {
  type: ActionTypes.GET_INVOICES;
  payload: {
    total: number;
    invoices: InvoiceListResponse;
  };
}

interface AddInvoice {
  type: ActionTypes.ADD_INVOICE;
  payload: Invoice;
}

export type Action = GetInvoices | AddInvoice;