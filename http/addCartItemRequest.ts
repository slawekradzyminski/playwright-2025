import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';
import type { CartItemDto } from '../types/cart';

const CART_ITEMS_ENDPOINT = '/api/cart/items';

export const addCartItem = async (
  request: APIRequestContext,
  item: CartItemDto,
  token?: string
): Promise<APIResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.post(`${API_BASE_URL}${CART_ITEMS_ENDPOINT}`, {
    headers,
    data: item
  });
};
