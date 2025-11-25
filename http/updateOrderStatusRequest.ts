import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';
import type { OrderStatus } from '../types/orders';

const ORDER_STATUS_ENDPOINT = '/api/orders';

export const updateOrderStatus = async (
  request: APIRequestContext,
  orderId: number,
  status: OrderStatus,
  token?: string
): Promise<APIResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.put(`${API_BASE_URL}${ORDER_STATUS_ENDPOINT}/${orderId}/status`, {
    headers,
    data: JSON.stringify(status)
  });
};
