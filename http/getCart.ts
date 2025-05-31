import { APIRequestContext } from "@playwright/test";
import { API_URL } from "../config/constants";

const CART_ENDPOINT = '/api/cart';

export function getCart(request: APIRequestContext, token: string) {
    return request.get(`${API_URL}${CART_ENDPOINT}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
} 