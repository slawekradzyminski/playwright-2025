import type { APIRequestContext, APIResponse } from '@playwright/test';

const PRODUCTS_ENDPOINT = '/api/v1/products';

export class ProductClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string
  ) {}

  getProducts(token?: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${PRODUCTS_ENDPOINT}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }

  getProductById(id: number, token?: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${PRODUCTS_ENDPOINT}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }
}
