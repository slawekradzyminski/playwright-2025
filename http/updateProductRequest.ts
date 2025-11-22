import { APIRequestContext } from '@playwright/test';
import type { ProductUpdateDto } from '../types/product';
import { API_BASE_URL } from '../config/constants';

const UPDATE_PRODUCT_ENDPOINT = '/api/products';

export const updateProduct = async (
  request: APIRequestContext,
  token: string,
  productId: number,
  productData: ProductUpdateDto
) => {
  return await request.put(`${API_BASE_URL}${UPDATE_PRODUCT_ENDPOINT}/${productId}`, {
    data: productData,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const updateProductWithoutAuth = async (
  request: APIRequestContext,
  productId: number,
  productData: ProductUpdateDto
) => {
  return await request.put(`${API_BASE_URL}${UPDATE_PRODUCT_ENDPOINT}/${productId}`, {
    data: productData,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
