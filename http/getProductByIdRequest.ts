import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';

const GET_PRODUCT_BY_ID_ENDPOINT = '/api/products';

export const getProductById = async (
  request: APIRequestContext,
  token: string,
  productId: number
) => {
  return await request.get(`${API_BASE_URL}${GET_PRODUCT_BY_ID_ENDPOINT}/${productId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const getProductByIdWithoutAuth = async (
  request: APIRequestContext,
  productId: number
) => {
  return await request.get(`${API_BASE_URL}${GET_PRODUCT_BY_ID_ENDPOINT}/${productId}`);
};

