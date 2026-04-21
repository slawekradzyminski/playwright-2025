import type { APIResponse } from '@playwright/test';
import type { CartItemDto, UpdateCartItemDto } from '../types/cart';
import { BaseApiClient } from './baseApiClient';

export const CART_ENDPOINT = '/api/v1/cart';

export class CartClient extends BaseApiClient {
  async getCart(token?: string): Promise<APIResponse> {
    return this.get(CART_ENDPOINT, token);
  }

  async clearCart(token?: string): Promise<APIResponse> {
    return this.delete(CART_ENDPOINT, token);
  }

  async addItem(cartItem: CartItemDto, token?: string): Promise<APIResponse> {
    return this.postJson(`${CART_ENDPOINT}/items`, cartItem, token);
  }

  async updateItem(productId: number, cartItem: UpdateCartItemDto, token?: string): Promise<APIResponse> {
    return this.putJson(`${CART_ENDPOINT}/items/${productId}`, cartItem, token);
  }

  async removeItem(productId: number, token?: string): Promise<APIResponse> {
    return this.delete(`${CART_ENDPOINT}/items/${productId}`, token);
  }
}
