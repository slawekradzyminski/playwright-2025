import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';
import type { OrderStatus } from '../../types/orders';

const ORDERS_ENDPOINT = '/api/orders';

export interface GetOrdersQuery {
  status?: OrderStatus;
  page?: number;
  size?: number;
}

export const getOrders = async (
  request: APIRequestContext,
  token?: string,
  query?: GetOrdersQuery
): Promise<APIResponse> => {
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const params = buildQueryParams(query);

  return await request.get(`${API_BASE_URL}${ORDERS_ENDPOINT}`, {
    headers,
    params
  });
};

const buildQueryParams = (
  query?: GetOrdersQuery
): Record<string, string | number | boolean> | undefined => {
  if (!query) {
    return undefined;
  }

  const params: Record<string, string | number | boolean> = {};

  if (query.status) {
    params.status = query.status;
  }

  if (query.page !== undefined) {
    params.page = query.page;
  }

  if (query.size !== undefined) {
    params.size = query.size;
  }

  return Object.keys(params).length > 0 ? params : undefined;
};
