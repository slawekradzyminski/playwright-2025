import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { ProductCreateDto, ProductUpdateDto } from '../types/product';

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

  createProduct(product: ProductCreateDto, token?: string): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}${PRODUCTS_ENDPOINT}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      data: product
    });
  }

  updateProduct(id: number, product: ProductUpdateDto, token?: string): Promise<APIResponse> {
    return this.request.put(`${this.baseUrl}${PRODUCTS_ENDPOINT}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      data: product
    });
  }

  deleteProduct(id: number, token?: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}${PRODUCTS_ENDPOINT}/${id}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }
}
