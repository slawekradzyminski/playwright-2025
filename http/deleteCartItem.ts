import { APIRequestContext } from "@playwright/test";
import { API_URL } from "../config/constants";

const CART_ITEMS_ENDPOINT = '/api/cart/items';

export function deleteCartItem(request: APIRequestContext, token: string, productId: number) {
    return request.delete(`${API_URL}${CART_ITEMS_ENDPOINT}/${productId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
} 