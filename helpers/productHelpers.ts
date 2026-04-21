import { expect } from '@playwright/test';
import type { ProductDto } from '../types/product';
import { ProductsClient } from '../httpclients/productsClient';

export const isValidProduct = (product: ProductDto): void => {
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

export const getSeededProduct = async (productsClient: ProductsClient, token: string): Promise<ProductDto> => {
  const productsResponse = await productsClient.getProducts(token);
  expect(productsResponse.status()).toBe(200);

  const products: ProductDto[] = await productsResponse.json();
  expect(products.length).toBeGreaterThan(0);

  return products[0];
};
