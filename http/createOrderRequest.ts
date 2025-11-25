import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';
import type { AddressDto } from '../types/orders';

const ORDERS_ENDPOINT = '/api/orders';

export const createOrder = async (
  request: APIRequestContext,
  address: AddressDto,
  token?: string
): Promise<APIResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.post(`${API_BASE_URL}${ORDERS_ENDPOINT}`, {
    data: address,
    headers
  });
};
