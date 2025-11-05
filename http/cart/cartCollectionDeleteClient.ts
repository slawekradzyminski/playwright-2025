import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';

const CART_ENDPOINT = '/api/cart';

export const clearCart = async (
  request: APIRequestContext,
  token: string,
): Promise<APIResponse> => {
  return await request.delete(`${API_BASE_URL}${CART_ENDPOINT}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const clearCartWithoutAuth = async (request: APIRequestContext): Promise<APIResponse> => {
  return await request.delete(`${API_BASE_URL}${CART_ENDPOINT}`);
};
