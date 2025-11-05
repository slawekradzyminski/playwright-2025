import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';
import type { CartItemDto } from '../../types/cart';

const CART_ITEMS_ENDPOINT = '/api/cart/items';

export const addItemToCart = async (
  request: APIRequestContext,
  token: string,
  payload: CartItemDto,
): Promise<APIResponse> => {
  return await request.post(`${API_BASE_URL}${CART_ITEMS_ENDPOINT}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};

export const addItemToCartWithoutAuth = async (
  request: APIRequestContext,
  payload: CartItemDto,
): Promise<APIResponse> => {
  return await request.post(`${API_BASE_URL}${CART_ITEMS_ENDPOINT}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    data: payload,
  });
};
