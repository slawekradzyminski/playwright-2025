import type { APIRequestContext, APIResponse } from '@playwright/test';
import { APP_BASE_URL } from '../config/constants';
import { buildAuthHeaders } from './httpUtils';

export const PRODUCTS_ENDPOINT = '/api/v1/products';

export class ProductsClient {
  constructor(private readonly request: APIRequestContext) {}

  async getProducts(token?: string): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${PRODUCTS_ENDPOINT}`, {
      headers: buildAuthHeaders(token)
    });
  }

  async getProductById(productId: number, token?: string): Promise<APIResponse> {
    return this.request.get(`${APP_BASE_URL}${PRODUCTS_ENDPOINT}/${productId}`, {
      headers: buildAuthHeaders(token)
    });
  }
}
