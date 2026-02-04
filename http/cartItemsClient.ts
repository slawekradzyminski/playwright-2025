import { APIRequestContext } from '@playwright/test';
import type { CartItemDto, UpdateCartItemDto } from '../types/cart';
import { API_BASE_URL } from '../config/constants';
import { getBearerAuthHeaders, getJsonAuthHeaders } from './requestHeaders';

export const CART_ITEMS_ENDPOINT = '/api/cart/items';

export const addCartItem = async (
  request: APIRequestContext,
  jwtToken: string,
  payload: CartItemDto
) => {
  return await request.post(`${API_BASE_URL}${CART_ITEMS_ENDPOINT}`, {
    data: payload,
    headers: getJsonAuthHeaders(jwtToken)
  });
};

export const updateCartItem = async (
  request: APIRequestContext,
  jwtToken: string,
  productId: number,
  payload: UpdateCartItemDto
) => {
  return await request.put(`${API_BASE_URL}${CART_ITEMS_ENDPOINT}/${productId}`, {
    data: payload,
    headers: getJsonAuthHeaders(jwtToken)
  });
};

export const deleteCartItem = async (
  request: APIRequestContext,
  jwtToken: string,
  productId: number
) => {
  return await request.delete(`${API_BASE_URL}${CART_ITEMS_ENDPOINT}/${productId}`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};
