import { APIRequestContext } from '@playwright/test';
import type { UpdateCartItemDto } from '../../types/cart';
import { API_BASE_URL } from '../../config/constants';

const CART_ITEM_ENDPOINT = '/api/cart/items';

export const updateCartItem = async (
  request: APIRequestContext,
  token: string,
  productId: number,
  updateData: UpdateCartItemDto
) => {
  return await request.put(`${API_BASE_URL}${CART_ITEM_ENDPOINT}/${productId}`, {
    data: updateData,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const updateCartItemWithoutAuth = async (
  request: APIRequestContext,
  productId: number,
  updateData: UpdateCartItemDto
) => {
  return await request.put(`${API_BASE_URL}${CART_ITEM_ENDPOINT}/${productId}`, {
    data: updateData,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
