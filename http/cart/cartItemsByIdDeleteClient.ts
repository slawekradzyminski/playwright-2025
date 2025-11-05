import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';

const CART_ITEMS_ENDPOINT = '/api/cart/items';

export const removeCartItem = async (
  request: APIRequestContext,
  token: string,
  productId: number,
): Promise<APIResponse> => {
  return await request.delete(`${API_BASE_URL}${CART_ITEMS_ENDPOINT}/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const removeCartItemWithoutAuth = async (
  request: APIRequestContext,
  productId: number,
): Promise<APIResponse> => {
  return await request.delete(`${API_BASE_URL}${CART_ITEMS_ENDPOINT}/${productId}`);
};
