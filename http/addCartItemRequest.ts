import { APIRequestContext } from '@playwright/test';
import type { CartItemDto } from '../types/cart';
import { API_BASE_URL } from '../config/constants';

const CART_ITEMS_ENDPOINT = '/api/cart/items';

export const addCartItem = async (
  request: APIRequestContext,
  token: string,
  cartItem: CartItemDto
) => {
  return await request.post(`${API_BASE_URL}${CART_ITEMS_ENDPOINT}`, {
    data: cartItem,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const addCartItemWithoutAuth = async (
  request: APIRequestContext,
  cartItem: CartItemDto
) => {
  return await request.post(`${API_BASE_URL}${CART_ITEMS_ENDPOINT}`, {
    data: cartItem,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
