import { expect, type APIResponse } from '@playwright/test';
import type { ProductDto } from '../../../types/product';

export const assertProductListResponse = async (response: APIResponse): Promise<ProductDto[]> => {
  const responseBody: ProductDto[] = await response.json();
  expect(Array.isArray(responseBody)).toBe(true);
  responseBody.forEach(assertProduct);

  return responseBody;
};

export const assertProductResponse = async (response: APIResponse, expectedId: number) => {
  const responseBody: ProductDto = await response.json();
  expect(responseBody.id).toBe(expectedId);
  assertProduct(responseBody);
};

export const assertProduct = (product: ProductDto) => {
  expect(product.id).toEqual(expect.any(Number));
  expect(product.name).toEqual(expect.any(String));
  expect(product.description).toEqual(expect.any(String));
  expect(product.price).toEqual(expect.any(Number));
  expect(product.stockQuantity).toEqual(expect.any(Number));
  expect(product.category).toEqual(expect.any(String));
  expect(product.imageUrl).toEqual(expect.any(String));
  expect(product.createdAt).toEqual(expect.any(String));
  expect(product.updatedAt).toEqual(expect.any(String));
};
