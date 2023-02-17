interface PaymentInterface {
  id: string;
  paymentType: string;
  amount: number;
  tenantId: string;
  invoiceId: string;
  createdAt: string;
  updatedAt: string;
}

type Payment = PaymentInterface | Omit<PaymentInterface, 'id' | 'tenantId' | 'invoiceId' | 'createdAt' | 'updatedAt'>;

interface InvoiceInterface {
  id: string;
  customerName: string;
  customerPhone: string;
  productName: string;
  productQuantity: number;
  productPrice: number;
  productMeasurements: string;
  netPayable: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
  payments: Payment[];
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

export interface SuggestionsResponse {
  products: {
    brand: string[];
    name: string[];
    width: number[];
    height: number[];
    quantity: number[];
    price: number[];
  };
  invoices: any;
}