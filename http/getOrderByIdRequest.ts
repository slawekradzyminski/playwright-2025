import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';

const ORDER_ENDPOINT = '/api/orders';

export const getOrderById = async (
  request: APIRequestContext,
  orderId: number,
  token?: string
): Promise<APIResponse> => {
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.get(`${API_BASE_URL}${ORDER_ENDPOINT}/${orderId}`, {
    headers
  });
};
