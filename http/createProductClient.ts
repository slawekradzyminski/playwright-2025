import { API_BASE_URL } from '../config/constants';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { ProductCreateDto } from '../types/product';
import { jsonHeaders } from './httpCommon';

const CREATE_PRODUCT_ENDPOINT = '/api/products';

export const createProduct = async (request: APIRequestContext, productData: ProductCreateDto, token: string): Promise<APIResponse> => {
  return await request.post(`${API_BASE_URL}${CREATE_PRODUCT_ENDPOINT}`, {
    data: productData,
    headers: jsonHeaders(token)
  });
};

export const createProductNoAuth = async (request: APIRequestContext, productData: ProductCreateDto): Promise<APIResponse> => {
  return await request.post(`${API_BASE_URL}${CREATE_PRODUCT_ENDPOINT}`, {
    data: productData,
    headers: jsonHeaders()
  });
};
