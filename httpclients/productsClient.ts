import type { APIResponse } from '@playwright/test';
import { BaseApiClient } from './baseApiClient';

export const PRODUCTS_ENDPOINT = '/api/v1/products';

export class ProductsClient extends BaseApiClient {
  async getProducts(token?: string): Promise<APIResponse> {
    return this.get(PRODUCTS_ENDPOINT, token);
  }

  async getProductById(productId: number, token?: string): Promise<APIResponse> {
    return this.get(`${PRODUCTS_ENDPOINT}/${productId}`, token);
  }
}
