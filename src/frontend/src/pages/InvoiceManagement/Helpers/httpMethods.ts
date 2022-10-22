import requests from "../../../http";
import { Invoice } from "../../../config/types";
import { CreateInvoiceResponse, InvoiceListResponse } from "./types";

export const getInvoiceList = (): Promise<InvoiceListResponse> => requests.get('/invoices');
export const createInvoice = (invoice: Invoice): Promise<CreateInvoiceResponse> => requests.post('/invoices/add', { ...invoice });
