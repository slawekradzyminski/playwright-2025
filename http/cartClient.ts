import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';
import { getBearerAuthHeaders } from './requestHeaders';

export const CART_ENDPOINT = '/api/cart';

export const getCart = async (request: APIRequestContext, jwtToken: string) => {
  return await request.get(`${API_BASE_URL}${CART_ENDPOINT}`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};

export const clearCart = async (request: APIRequestContext, jwtToken: string) => {
  return await request.delete(`${API_BASE_URL}${CART_ENDPOINT}`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};
