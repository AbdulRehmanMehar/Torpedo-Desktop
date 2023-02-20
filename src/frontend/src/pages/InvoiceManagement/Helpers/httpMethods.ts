import { Invoice } from "../../../config/types";
import { CreateInvoiceResponse, InvoiceListResponse } from "./types";
import { getRequests } from "../../../http";
import { getAccessToken } from "../../../config/localstorage";

const requests = getRequests({
    headers: {
        Authorization: `Bearer ${getAccessToken()}`,
    }
});


export const getInvoiceList = (): Promise<{ total: number, invoices: InvoiceListResponse }> => requests.get('/invoices');
export const createInvoice = (invoice: Invoice): Promise<CreateInvoiceResponse> => requests.post('/invoices/add', { 
    customer: {
        name: invoice.customer.name,
        phone: invoice.customer.phone
    },
    products: invoice.products.map(product => ({ 
        id: product.id,
        price: product.price,
        quantity: product.quantity,
    })),
    payments: invoice.payments.map((payment) => ({
        paymentType: payment.paymentType,
        amount: payment.amount
    }))
});
