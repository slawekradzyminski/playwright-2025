import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';

const ORDER_BY_ID_ENDPOINT = (orderId: number | string) => `/api/orders/${orderId}`;

export const getOrderById = async (
  request: APIRequestContext,
  token: string,
  orderId: number
) => {
  return await request.get(`${API_BASE_URL}${ORDER_BY_ID_ENDPOINT(orderId)}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getOrderByIdWithoutAuth = async (
  request: APIRequestContext,
  orderId: number
) => {
  return await request.get(`${API_BASE_URL}${ORDER_BY_ID_ENDPOINT(orderId)}`);
};
