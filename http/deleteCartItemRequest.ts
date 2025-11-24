import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';

const CART_ITEMS_ENDPOINT = '/api/cart/items';

export const deleteCartItem = async (
  request: APIRequestContext,
  productId: number,
  token?: string
): Promise<APIResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.delete(`${API_BASE_URL}${CART_ITEMS_ENDPOINT}/${productId}`, {
    headers
  });
};
