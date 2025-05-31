import { APIRequestContext } from "@playwright/test";
import { API_URL } from "../config/constants";
import type { CartItemDto } from "../types/cart";

const CART_ITEMS_ENDPOINT = '/api/cart/items';

export function postCartItem(request: APIRequestContext, token: string, cartItem: CartItemDto) {
    return request.post(`${API_URL}${CART_ITEMS_ENDPOINT}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: cartItem
    });
} 