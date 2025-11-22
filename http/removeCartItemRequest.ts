import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';

const CART_ITEM_ENDPOINT = '/api/cart/items';

export const removeCartItem = async (
  request: APIRequestContext,
  token: string,
  productId: number
) => {
  return await request.delete(`${API_BASE_URL}${CART_ITEM_ENDPOINT}/${productId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const removeCartItemWithoutAuth = async (
  request: APIRequestContext,
  productId: number
) => {
  return await request.delete(`${API_BASE_URL}${CART_ITEM_ENDPOINT}/${productId}`);
};
