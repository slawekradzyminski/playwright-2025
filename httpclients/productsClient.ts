import type { APIRequestContext, APIResponse } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';

export const PRODUCTS_ENDPOINT = '/api/v1/products';

export class ProductsClient {
  constructor(private readonly request: APIRequestContext) {}

  async getProducts(token?: string): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${PRODUCTS_ENDPOINT}`, {
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
