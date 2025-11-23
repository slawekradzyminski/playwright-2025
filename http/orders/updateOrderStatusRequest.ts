import { APIRequestContext } from '@playwright/test';
import type { OrderStatus } from '../../types/order';
import { API_BASE_URL } from '../../config/constants';

const UPDATE_STATUS_ENDPOINT = (orderId: number | string) => `/api/orders/${orderId}/status`;

export const updateOrderStatus = async (
  request: APIRequestContext,
  token: string,
  orderId: number,
  status: OrderStatus
) => {
  return await request.put(`${API_BASE_URL}${UPDATE_STATUS_ENDPOINT(orderId)}`, {
    data: status,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};

export const updateOrderStatusWithoutAuth = async (
  request: APIRequestContext,
  orderId: number,
  status: OrderStatus
) => {
  return await request.put(`${API_BASE_URL}${UPDATE_STATUS_ENDPOINT(orderId)}`, {
    data: status,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
