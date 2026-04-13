import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { AddressDto, OrderStatus } from '../types/order';

const ORDERS_ENDPOINT = '/api/v1/orders';

export class OrderClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseUrl: string
  ) {}

  getAdminOrders(token?: string, query?: { status?: OrderStatus; page?: number; size?: number }): Promise<APIResponse> {
    return this.request.get(`${this.baseUrl}${ORDERS_ENDPOINT}/admin`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      params: query
    });
  }

  createOrder(address: AddressDto, token?: string): Promise<APIResponse> {
    return this.request.post(`${this.baseUrl}${ORDERS_ENDPOINT}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      data: address
    });
  }

  updateOrderStatus(id: number, status: OrderStatus, token?: string): Promise<APIResponse> {
    return this.request.put(`${this.baseUrl}${ORDERS_ENDPOINT}/${id}/status`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      data: status
    });
  }
}
