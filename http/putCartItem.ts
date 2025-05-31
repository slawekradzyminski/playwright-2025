import { APIRequestContext } from "@playwright/test";
import { API_URL } from "../config/constants";
import type { UpdateCartItemDto } from "../types/cart";

const CART_ITEMS_ENDPOINT = '/api/cart/items';

export function putCartItem(request: APIRequestContext, token: string, productId: number, updateData: UpdateCartItemDto) {
    return request.put(`${API_URL}${CART_ITEMS_ENDPOINT}/${productId}`, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        data: updateData
    });
} 