import type { APIResponse } from '@playwright/test';
import type { ProductCreateDto, ProductUpdateDto } from '../types/product';
import { BaseApiClient } from './baseApiClient';

export const PRODUCTS_ENDPOINT = '/api/v1/products';

export class ProductsClient extends BaseApiClient {
  async getProducts(token?: string): Promise<APIResponse> {
    return this.get(PRODUCTS_ENDPOINT, token);
  }

  async getProductById(productId: number, token?: string): Promise<APIResponse> {
    return this.get(`${PRODUCTS_ENDPOINT}/${productId}`, token);
  }

  async createProduct(productData: ProductCreateDto, token?: string): Promise<APIResponse> {
    return this.postJson(PRODUCTS_ENDPOINT, productData, token);
  }

  async updateProduct(productId: number, productData: ProductUpdateDto, token?: string): Promise<APIResponse> {
    return this.putJson(`${PRODUCTS_ENDPOINT}/${productId}`, productData, token);
  }

  async deleteProduct(productId: number, token?: string): Promise<APIResponse> {
    return this.delete(`${PRODUCTS_ENDPOINT}/${productId}`, token);
  }
}
