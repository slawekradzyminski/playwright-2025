import { APIRequestContext } from '@playwright/test';
import { API_BASE_URL } from '../config/constants';
import type { ProductUpdateDto } from '../types/product';

const PRODUCTS_ENDPOINT = '/api/products';

export const updateProduct = async (
  request: APIRequestContext,
  id: number,
  productData: ProductUpdateDto,
  token?: string
) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.put(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/${id}`, {
    data: productData,
    headers
  });
};
