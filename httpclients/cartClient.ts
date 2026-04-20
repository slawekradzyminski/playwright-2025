import type { APIRequestContext, APIResponse } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';

export const CART_ENDPOINT = '/api/v1/cart';

export class CartClient {
  constructor(private readonly request: APIRequestContext) {}

  async getCart(token?: string): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${CART_ENDPOINT}`, {
      headers: addHeaders(token)
    });
  }

  async clearCart(token?: string): Promise<APIResponse> {
    return this.request.delete(`${APP_BASE_URL}${CART_ENDPOINT}`, {
      headers: addHeaders(token)
    });
  }
}

const addHeaders = (token?: string) => {
  return token
    ? {
        Authorization: `Bearer ${token}`
      }
    : undefined;
};
