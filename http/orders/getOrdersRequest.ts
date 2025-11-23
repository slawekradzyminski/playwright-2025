import { APIRequestContext } from '@playwright/test';
import type { OrderStatus } from '../../types/order';
import { API_BASE_URL } from '../../config/constants';

const ORDERS_ENDPOINT = '/api/orders';

export interface GetOrdersQuery {
  page?: number;
  size?: number;
  status?: OrderStatus;
}

const buildQueryParams = (query?: GetOrdersQuery) => {
  if (!query) {
    return undefined;
  }

  const params: Record<string, string | number | boolean> = {};

  if (typeof query.page === 'number') {
    params.page = query.page;
  }

  if (typeof query.size === 'number') {
    params.size = query.size;
  }

  if (query.status) {
    params.status = query.status;
  }

  return params;
};

export const getOrders = async (
  request: APIRequestContext,
  token: string,
  query?: GetOrdersQuery
) => {
  return await request.get(`${API_BASE_URL}${ORDERS_ENDPOINT}`, {
    params: buildQueryParams(query),
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getOrdersWithoutAuth = async (
  request: APIRequestContext,
  query?: GetOrdersQuery
) => {
  return await request.get(`${API_BASE_URL}${ORDERS_ENDPOINT}`, {
    params: buildQueryParams(query)
  });
};
