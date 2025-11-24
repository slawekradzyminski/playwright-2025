import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';
import type { UpdateCartItemDto } from '../types/cart';

const CART_ITEMS_ENDPOINT = '/api/cart/items';

export const updateCartItem = async (
  request: APIRequestContext,
  productId: number,
  updateData: UpdateCartItemDto,
  token?: string
): Promise<APIResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.put(`${API_BASE_URL}${CART_ITEMS_ENDPOINT}/${productId}`, {
    headers,
    data: updateData
  });
};
