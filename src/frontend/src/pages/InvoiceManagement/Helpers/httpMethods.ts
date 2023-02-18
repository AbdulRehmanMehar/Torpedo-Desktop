import { Invoice } from "../../../config/types";
import { CreateInvoiceResponse, InvoiceListResponse } from "./types";
import { getRequests } from "../../../http";
import { getAccessToken } from "../../../config/localstorage";

const requests = getRequests({
    headers: {
        Authorization: `Bearer ${getAccessToken()}`,
    }
});


export const getInvoiceList = (): Promise<InvoiceListResponse> => requests.get('/invoices');
export const createInvoice = (invoice: Invoice): Promise<CreateInvoiceResponse> => requests.post('/invoices/add', { ...invoice });
