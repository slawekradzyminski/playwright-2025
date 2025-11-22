import { APIRequestContext } from '@playwright/test';
import type { ProductCreateDto } from '../types/product';
import { API_BASE_URL } from '../config/constants';

const CREATE_PRODUCT_ENDPOINT = '/api/products';

export const createProduct = async (
  request: APIRequestContext,
  token: string,
  productData: ProductCreateDto
) => {
  return await request.post(`${API_BASE_URL}${CREATE_PRODUCT_ENDPOINT}`, {
    data: productData,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
};

export const createProductWithoutAuth = async (
  request: APIRequestContext,
  productData: ProductCreateDto
) => {
  return await request.post(`${API_BASE_URL}${CREATE_PRODUCT_ENDPOINT}`, {
    data: productData,
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

