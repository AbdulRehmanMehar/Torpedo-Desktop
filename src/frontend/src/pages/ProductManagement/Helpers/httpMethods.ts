import { getRequests } from "../../../http";
import { ProductResponse } from "../../../config/types";
import { getAccessToken } from "../../../config/localstorage";

const requests = getRequests({
    headers: {
        Authorization: `Bearer ${getAccessToken()}`,
    }
});

export const listProducts = (params: any): Promise<{ products: ProductResponse[], total: number }> => requests.get(`/products?${new URLSearchParams(params).toString()}`);
export const addProduct = (productData: Omit<ProductResponse, 'id'>): Promise<any> => requests.post('/products/add', {...productData});
export const updateTheProduct = (productData: ProductResponse): Promise<any> => requests.post(`/products/update/${productData.id}`, {...productData});
export const getProductById = (productId: string): Promise<any> => requests.get(`/products/${productId}`);
