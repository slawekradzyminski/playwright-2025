import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';

const PRODUCTS_ENDPOINT = '/api/products';

export const getProductById = async (
  request: APIRequestContext,
  token: string,
  id: number,
): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getProductByIdWithoutAuth = async (
  request: APIRequestContext,
  id: number,
): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/${id}`);
};
