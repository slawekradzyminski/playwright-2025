import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { CartItemDto, UpdateCartItemDto } from '../types/cart';
import { APP_BASE_URL } from '../config/constants';
import { buildAuthHeaders, buildJsonHeaders } from './httpUtils';

export const CART_ENDPOINT = '/api/v1/cart';

export class CartClient {
  constructor(private readonly request: APIRequestContext) {}

  async getCart(token?: string): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${CART_ENDPOINT}`, {
      headers: buildAuthHeaders(token)
    });
  }

  async clearCart(token?: string): Promise<APIResponse> {
    return this.request.delete(`${APP_BASE_URL}${CART_ENDPOINT}`, {
      headers: buildAuthHeaders(token)
    });
  }

  async addItem(cartItem: CartItemDto, token?: string): Promise<APIResponse> {
    return this.request.post(`${APP_BASE_URL}${CART_ENDPOINT}/items`, {
      data: cartItem,
      headers: buildJsonHeaders(token)
    });
  }

  async updateItem(productId: number, cartItem: UpdateCartItemDto, token?: string): Promise<APIResponse> {
    return this.request.put(`${APP_BASE_URL}${CART_ENDPOINT}/items/${productId}`, {
      data: cartItem,
      headers: buildJsonHeaders(token)
    });
  }

  async removeItem(productId: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`${APP_BASE_URL}${CART_ENDPOINT}/items/${productId}`, {
      headers: buildAuthHeaders(token)
    });
  }
}
