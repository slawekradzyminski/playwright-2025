import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';
import type { ProductCreateDto } from '../../types/product';

const PRODUCTS_ENDPOINT = '/api/products';

export const createProduct = async (
  request: APIRequestContext,
  token: string,
  payload: ProductCreateDto,
): Promise<APIResponse> => {
  return await request.post(`${API_BASE_URL}${PRODUCTS_ENDPOINT}`, {
    data: payload,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const createProductWithoutAuth = async (
  request: APIRequestContext,
  payload: ProductCreateDto | Partial<ProductCreateDto>,
): Promise<APIResponse> => {
  return await request.post(`${API_BASE_URL}${PRODUCTS_ENDPOINT}`, {
    data: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
