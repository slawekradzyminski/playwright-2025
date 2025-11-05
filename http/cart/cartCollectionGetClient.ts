import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';

const CART_ENDPOINT = '/api/cart';

export const getCart = async (
  request: APIRequestContext,
  token: string,
): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${CART_ENDPOINT}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getCartWithoutAuth = async (request: APIRequestContext): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${CART_ENDPOINT}`);
};
