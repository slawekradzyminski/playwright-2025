import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';

const GET_ALL_PRODUCTS_ENDPOINT = '/api/products';

export const getAllProducts = async (
  request: APIRequestContext,
  token: string
) => {
  return await request.get(`${API_BASE_URL}${GET_ALL_PRODUCTS_ENDPOINT}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getAllProductsWithoutAuth = async (
  request: APIRequestContext
) => {
  return await request.get(`${API_BASE_URL}${GET_ALL_PRODUCTS_ENDPOINT}`);
};

