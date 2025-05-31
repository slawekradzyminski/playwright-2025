import { APIRequestContext } from "@playwright/test";
import { API_URL } from "../config/constants";

const PRODUCTS_ENDPOINT = '/api/products';

export function getProducts(request: APIRequestContext, token: string) {
    return request.get(`${API_URL}${PRODUCTS_ENDPOINT}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
}