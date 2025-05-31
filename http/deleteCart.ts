import { APIRequestContext } from "@playwright/test";
import { API_URL } from "../config/constants";

const CART_ENDPOINT = '/api/cart';

export function deleteCart(request: APIRequestContext, token: string) {
    return request.delete(`${API_URL}${CART_ENDPOINT}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
} 