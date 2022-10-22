import { Invoice } from "../../../config/types";

export interface InvoiceListResponse {
  invoices: Invoice[];
}

export interface CreateInvoiceResponse {
  invoice: Invoice;
}

export type { Invoice };