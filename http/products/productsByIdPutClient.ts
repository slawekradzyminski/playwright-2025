import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';
import type { ProductUpdateDto } from '../../types/product';

const PRODUCTS_ENDPOINT = '/api/products';

export const updateProductById = async (
  request: APIRequestContext,
  token: string,
  id: number,
  payload: ProductUpdateDto,
): Promise<APIResponse> => {
  return await request.put(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/${id}`, {
    data: payload,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
};

export const updateProductByIdWithoutAuth = async (
  request: APIRequestContext,
  id: number,
  payload: ProductUpdateDto,
): Promise<APIResponse> => {
  return await request.put(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/${id}`, {
    data: payload,
    headers: {
      'Content-Type': 'application/json',
    },
  });
};
