import { APIRequestContext } from '@playwright/test';
import type { OrderStatus } from '../../types/order';
import { API_BASE_URL } from '../../config/constants';

const ADMIN_ORDERS_ENDPOINT = '/api/orders/admin';

export interface GetAdminOrdersQuery {
  status?: OrderStatus;
  page?: number;
  size?: number;
}

const buildAdminQueryParams = (query?: GetAdminOrdersQuery) => {
  if (!query) {
    return undefined;
  }

  const params: Record<string, string | number | boolean> = {};

  if (query.status) {
    params.status = query.status;
  }

  if (typeof query.page === 'number') {
    params.page = query.page;
  }

  if (typeof query.size === 'number') {
    params.size = query.size;
  }

  return params;
};

export const getAdminOrders = async (
  request: APIRequestContext,
  token: string,
  query?: GetAdminOrdersQuery
) => {
  return await request.get(`${API_BASE_URL}${ADMIN_ORDERS_ENDPOINT}`, {
    params: buildAdminQueryParams(query),
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getAdminOrdersWithoutAuth = async (
  request: APIRequestContext,
  query?: GetAdminOrdersQuery
) => {
  return await request.get(`${API_BASE_URL}${ADMIN_ORDERS_ENDPOINT}`, {
    params: buildAdminQueryParams(query)
  });
};
