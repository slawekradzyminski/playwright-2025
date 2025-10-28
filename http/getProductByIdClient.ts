import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';

const PRODUCTS_ENDPOINT = '/api/products';

export const getProductById = async (request: APIRequestContext, id: number, token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.get(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/${id}`, {
    headers
  });
};
