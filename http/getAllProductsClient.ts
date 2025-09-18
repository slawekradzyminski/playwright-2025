import { API_BASE_URL } from '../config/constants';
import { APIRequestContext, APIResponse } from '@playwright/test';
import { jsonHeaders } from './httpCommon';

const GET_ALL_PRODUCTS_ENDPOINT = '/api/products';

export const getAllProducts = async (request: APIRequestContext, token: string): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${GET_ALL_PRODUCTS_ENDPOINT}`, {
    headers: jsonHeaders(token)
  });
};

export const getAllProductsNoAuth = async (request: APIRequestContext): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${GET_ALL_PRODUCTS_ENDPOINT}`, {
    headers: jsonHeaders()
  });
};
