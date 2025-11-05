import { APIRequestContext, APIResponse } from '@playwright/test';
import { API_BASE_URL } from '../../../config/constants';
import { createProduct } from '../../../http/products/productsCollectionPostClient';
import type { ProductCreateDto, ProductDto } from '../../../types/product';

const PRODUCTS_ENDPOINT = `${API_BASE_URL}/api/products`;

export const createProductViaApi = async (
  request: APIRequestContext,
  token: string,
  payload: ProductCreateDto,
): Promise<ProductDto> => {
  const response = await createProduct(request, token, payload);
  if (response.status() !== 201) {
    throw new Error(`Failed to create product. Status: ${response.status()}`);
  }
  return (await response.json()) as ProductDto;
};

export const deleteProductViaApi = async (
  request: APIRequestContext,
  token: string,
  productId: number,
): Promise<APIResponse> => {
  return await request.delete(`${PRODUCTS_ENDPOINT}/${productId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
