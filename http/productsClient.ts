import { APIRequestContext } from '@playwright/test';
import type { ProductCreateDto, ProductUpdateDto } from '../types/product';
import { API_BASE_URL } from '../config/constants';
import { getBearerAuthHeaders, getJsonAuthHeaders } from './requestHeaders';

export const PRODUCTS_ENDPOINT = '/api/products';

export const getProducts = async (request: APIRequestContext, jwtToken: string) => {
  return await request.get(`${API_BASE_URL}${PRODUCTS_ENDPOINT}`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};

export const getProductById = async (
  request: APIRequestContext,
  jwtToken: string,
  productId: number
) => {
  return await request.get(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/${productId}`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};

export const createProduct = async (
  request: APIRequestContext,
  jwtToken: string,
  payload: ProductCreateDto
) => {
  return await request.post(`${API_BASE_URL}${PRODUCTS_ENDPOINT}`, {
    data: payload,
    headers: getJsonAuthHeaders(jwtToken)
  });
};

export const updateProduct = async (
  request: APIRequestContext,
  jwtToken: string,
  productId: number,
  payload: ProductUpdateDto
) => {
  return await request.put(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/${productId}`, {
    data: payload,
    headers: getJsonAuthHeaders(jwtToken)
  });
};

export const deleteProduct = async (
  request: APIRequestContext,
  jwtToken: string,
  productId: number
) => {
  return await request.delete(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/${productId}`, {
    headers: getBearerAuthHeaders(jwtToken)
  });
};
