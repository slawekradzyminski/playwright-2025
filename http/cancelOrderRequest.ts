import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';

const CANCEL_ORDER_ENDPOINT = '/api/orders';

export const cancelOrder = async (
  request: APIRequestContext,
  orderId: number,
  token?: string
): Promise<APIResponse> => {
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.post(`${API_BASE_URL}${CANCEL_ORDER_ENDPOINT}/${orderId}/cancel`, {
    headers
  });
};
