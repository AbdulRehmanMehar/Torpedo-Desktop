interface PaymentInterface {
  paymentType: string;
  amount: number;
}

type Payment = PaymentInterface | Omit<PaymentInterface, 'id' | 'tenantId' | 'invoiceId' | 'createdAt' | 'updatedAt'>;

interface CustomerInterface {
  name: string;
  phone: string;
}

interface ProductAsInvoiceItem {
  id: string;
  price: number;
  quantity: number;
  defaultProductPrice?: number;
}

interface InvoiceInterface {
  id: string;
  customer: CustomerInterface;
  products: ProductAsInvoiceItem[];
  invoiceItems: Array<ProductAsInvoiceItem & {product: ProductResponse}>;
  payments: Payment[];
  netPayable?: number;
}

export type Invoice = InvoiceInterface;


export type ActionArgs = {
  data: Invoice | any,
  onError: (...args: any | any[]) => void;
  onSuccess: (...args: any | any[]) => void;
  onComplete: () => void;
}

export interface AuthenticationCredentials {
  email: string;
  password: string;
}

export type AuthenticatedUser = {
  name: string;
  email: string;
};

export type AuthenticatedTenant = {
  name: string;
};

export interface AuthenticationResponse {
  token: string;
  user: AuthenticatedUser;
  tenant: AuthenticatedTenant;
}

export interface ProductResponse {
  id: string;
  brand: string;
  createdAt: string;
  height?: number;
  name: string;
  price: number;
  quality?: string;
  quantity: number;
  type: 'Tile' | 'Other';
  tenantId?: string;
  updatedAt: string;
  width?: number;
}

export interface ProductSuggestions {
  brand: string[];
  name: string[];
  width: number[];
  height: number[];
  quantity: number[];
  price: number[];
};

export interface InvoiceSuggestions {
  products: Array<{
    id: string;
    price: number;
    title: string;
    quality?: string;
    quantity: number;
    type: string;
    height?: string;
    width?: string;
  }>;
  customers: Array<{
    id: string;
    name: string;
    phone: string;
  }>
}

export interface SuggestionsResponse {
  products: ProductSuggestions;
  invoices: {};
}