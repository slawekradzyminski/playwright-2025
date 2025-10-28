import { APIRequestContext } from "@playwright/test";
import { API_BASE_URL } from "../config/constants";
import { ProductCreateDto } from "../types/product";

const PRODUCTS_ENDPOINT = '/api/products';

export const createProduct = async (request: APIRequestContext, productData: ProductCreateDto, token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return await request.post(`${API_BASE_URL}${PRODUCTS_ENDPOINT}`, {
    data: productData,
    headers
  });
};

