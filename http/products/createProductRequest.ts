import { APIRequestContext, APIResponse } from "@playwright/test";
import type { ProductCreateDto } from "../../types/products";
import { API_BASE_URL } from "../../config/constants";

const CREATE_PRODUCT_ENDPOINT = '/api/products';

export const createProduct = async (
  request: APIRequestContext,
  productData: ProductCreateDto,
  token?: string
): Promise<APIResponse> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return await request.post(`${API_BASE_URL}${CREATE_PRODUCT_ENDPOINT}`, {
    data: productData,
    headers,
  });
};

