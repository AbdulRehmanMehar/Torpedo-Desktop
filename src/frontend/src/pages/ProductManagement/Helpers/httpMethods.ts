import { getRequests } from "../../../http";
import { ProductResponse } from "../../../config/types";
import { getAccessToken } from "../../../config/localstorage";

const requests = getRequests({
    headers: {
        Authorization: `Bearer ${getAccessToken()}`,
    }
});

export const listProducts = (): Promise<{ products: ProductResponse[] }> => requests.get('/products');
export const addProduct = (productData: Omit<ProductResponse, 'id'>): Promise<any> => requests.post('/products/add', {...productData});
