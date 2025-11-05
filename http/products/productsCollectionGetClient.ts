import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../config/constants';

const PRODUCTS_ENDPOINT = '/api/products';

export const getAllProducts = async (
  request: APIRequestContext,
  token: string,
): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${PRODUCTS_ENDPOINT}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getAllProductsWithoutAuth = async (request: APIRequestContext): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${PRODUCTS_ENDPOINT}`);
};
