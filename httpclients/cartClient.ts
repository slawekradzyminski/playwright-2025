import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { AddCartItemDto } from '../types/cart';

const CART_ENDPOINT = '/api/v1/cart';
const CART_ITEMS_ENDPOINT = '/api/v1/cart/items';

export class CartClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string
  ) {}

  getCart(token?: string): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${CART_ENDPOINT}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }

  clearCart(token?: string): Promise<APIResponse> {
    return this.request.delete(`${this.baseUrl}${CART_ENDPOINT}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined
    });
  }

  addItem(item: AddCartItemDto, token?: string): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}${CART_ITEMS_ENDPOINT}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      data: item
    });
  }
}
