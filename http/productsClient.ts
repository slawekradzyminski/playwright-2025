import { APIRequestContext, APIResponse } from "@playwright/test";
import { API_BASE_URL } from "./costants";
import type { ProductCreateDto, ProductUpdateDto } from "../types/product";

const PRODUCTS_ENDPOINT = '/api/products';

export const getAllProducts = async (request: APIRequestContext, token: string): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${PRODUCTS_ENDPOINT}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const getAllProductsWithoutToken = async (request: APIRequestContext): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${PRODUCTS_ENDPOINT}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const createProduct = async (request: APIRequestContext, token: string, product: ProductCreateDto): Promise<APIResponse> => {
  return await request.post(`${API_BASE_URL}${PRODUCTS_ENDPOINT}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: product
  });
};

export const createProductWithoutToken = async (request: APIRequestContext, product: ProductCreateDto): Promise<APIResponse> => {
  return await request.post(`${API_BASE_URL}${PRODUCTS_ENDPOINT}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    data: product
  });
};

export const getProductById = async (request: APIRequestContext, token: string, id: number): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const getProductByIdWithoutToken = async (request: APIRequestContext, id: number): Promise<APIResponse> => {
  return await request.get(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/${id}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};

export const updateProduct = async (request: APIRequestContext, token: string, id: number, product: ProductUpdateDto): Promise<APIResponse> => {
  return await request.put(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    data: product
  });
};

export const updateProductWithoutToken = async (request: APIRequestContext, id: number, product: ProductUpdateDto): Promise<APIResponse> => {
  return await request.put(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/${id}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    data: product
  });
};

export const deleteProduct = async (request: APIRequestContext, token: string, id: number): Promise<APIResponse> => {
  return await request.delete(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/${id}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });
};

export const deleteProductWithoutToken = async (request: APIRequestContext, id: number): Promise<APIResponse> => {
  return await request.delete(`${API_BASE_URL}${PRODUCTS_ENDPOINT}/${id}`, {
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
