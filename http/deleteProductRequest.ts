import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';

const DELETE_PRODUCT_ENDPOINT = '/api/products';

export const deleteProduct = async (
  request: APIRequestContext,
  token: string,
  productId: number
) => {
  return await request.delete(`${API_BASE_URL}${DELETE_PRODUCT_ENDPOINT}/${productId}`, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
};

export const deleteProductWithoutAuth = async (
  request: APIRequestContext,
  productId: number
) => {
  return await request.delete(`${API_BASE_URL}${DELETE_PRODUCT_ENDPOINT}/${productId}`);
};
