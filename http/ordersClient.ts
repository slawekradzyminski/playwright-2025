import { APIRequestContext } from '@playwright/test';
import type { AddressDto, OrderStatus } from '../types/order';
import { API_BASE_URL } from '../config/constants';
import { getBearerAuthHeaders, getJsonAuthHeaders } from './requestHeaders';

export const ORDERS_ENDPOINT = '/api/orders';

export const getOrders = async (request: APIRequestContext, jwtToken: string) => {
  return await request.get(`${API_BASE_URL}${ORDERS_ENDPOINT}`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};

export const createOrder = async (
  request: APIRequestContext,
  jwtToken: string,
  payload: AddressDto
) => {
  return await request.post(`${API_BASE_URL}${ORDERS_ENDPOINT}`, {
    data: payload,
    headers: getJsonAuthHeaders(jwtToken)
  });
};

export const getOrderById = async (
  request: APIRequestContext,
  jwtToken: string,
  orderId: number
) => {
  return await request.get(`${API_BASE_URL}${ORDERS_ENDPOINT}/${orderId}`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};

export const cancelOrder = async (
  request: APIRequestContext,
  jwtToken: string,
  orderId: number
) => {
  return await request.post(`${API_BASE_URL}${ORDERS_ENDPOINT}/${orderId}/cancel`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};

export const getAdminOrders = async (request: APIRequestContext, jwtToken: string) => {
  return await request.get(`${API_BASE_URL}${ORDERS_ENDPOINT}/admin`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};

export const updateOrderStatus = async (
  request: APIRequestContext,
  jwtToken: string,
  orderId: number,
  status: OrderStatus | 'INVALID'
) => {
  return await request.put(`${API_BASE_URL}${ORDERS_ENDPOINT}/${orderId}/status`, {
    data: status,
    headers: getJsonAuthHeaders(jwtToken)
  });
};
