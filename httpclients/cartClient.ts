import type { APIRequestContext, APIResponse } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import { buildAuthHeaders } from './httpUtils';

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
}
