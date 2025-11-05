import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';
import type { UpdateCartItemDto } from '../../types/cart';

const CART_ITEMS_ENDPOINT = '/api/cart/items';

export const updateCartItem = async (
  request: APIRequestContext,
  token: string,
  productId: number,
  payload: UpdateCartItemDto,
): Promise<APIResponse> => {
  return await request.put(`${API_BASE_URL}${CART_ITEMS_ENDPOINT}/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

export const updateCartItemWithoutAuth = async (
  request: APIRequestContext,
  productId: number,
  payload: UpdateCartItemDto,
): Promise<APIResponse> => {
  return await request.put(`${API_BASE_URL}${CART_ITEMS_ENDPOINT}/${productId}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};
