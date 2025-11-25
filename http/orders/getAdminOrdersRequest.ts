import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';
import type { OrderStatus } from '../../types/orders';

const ADMIN_ORDERS_ENDPOINT = '/api/orders/admin';

export interface GetAdminOrdersQuery {
  status?: OrderStatus;
  page?: number;
  size?: number;
}

export const getAdminOrders = async (
  request: APIRequestContext,
  token?: string,
  query?: GetAdminOrdersQuery
): Promise<APIResponse> => {
  const headers: Record<string, string> = {};

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const params = buildQueryParams(query);

  return await request.get(`${API_BASE_URL}${ADMIN_ORDERS_ENDPOINT}`, {
    headers,
    params
  });
};

const buildQueryParams = (
  query?: GetAdminOrdersQuery
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
