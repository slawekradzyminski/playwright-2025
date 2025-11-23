import { APIRequestContext } from '@playwright/test';
import type { AddressDto } from '../../types/order';
import { API_BASE_URL } from '../../config/constants';

const ORDERS_ENDPOINT = '/api/orders';

export const createOrder = async (
  request: APIRequestContext,
  token: string,
  shippingAddress: AddressDto
) => {
  return await request.post(`${API_BASE_URL}${ORDERS_ENDPOINT}`, {
    data: shippingAddress,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};

export const createOrderWithoutAuth = async (
  request: APIRequestContext,
  shippingAddress: AddressDto
) => {
  return await request.post(`${API_BASE_URL}${ORDERS_ENDPOINT}`, {
    data: shippingAddress,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
