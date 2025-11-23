import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';

const CANCEL_ORDER_ENDPOINT = (orderId: number | string) => `/api/orders/${orderId}/cancel`;

export const cancelOrder = async (
  request: APIRequestContext,
  token: string,
  orderId: number
) => {
  return await request.post(`${API_BASE_URL}${CANCEL_ORDER_ENDPOINT(orderId)}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const cancelOrderWithoutAuth = async (request: APIRequestContext, orderId: number) => {
  return await request.post(`${API_BASE_URL}${CANCEL_ORDER_ENDPOINT(orderId)}`);
};
