import type { APIResponse } from '@playwright/test';
import type { AddressDto, OrdersQuery } from '../types/order';
import { BaseApiClient } from './baseApiClient';

export const ORDERS_ENDPOINT = '/api/v1/orders';

export class OrdersClient extends BaseApiClient {
  async getOrders(query: OrdersQuery = {}, token?: string): Promise<APIResponse> {
    return this.get(this.buildUrl(ORDERS_ENDPOINT, query), token);
  }

  async getOrderById(orderId: number, token?: string): Promise<APIResponse> {
    return this.get(`${ORDERS_ENDPOINT}/${orderId}`, token);
  }

  async createOrder(shippingAddress: AddressDto, token?: string): Promise<APIResponse> {
    return this.postJson(ORDERS_ENDPOINT, shippingAddress, token);
  }

  async cancelOrder(orderId: number, token?: string): Promise<APIResponse> {
    return this.postJson(`${ORDERS_ENDPOINT}/${orderId}/cancel`, undefined, token);
  }
}
