import { expect } from '@playwright/test';
import type { ProductsClient } from '../httpclients/productsClient';
import type { ProductDto } from '../types/product';
import { expectJsonResponse } from './apiAssertions';

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
  const products = await expectJsonResponse<ProductDto[]>(productsResponse, 200);
  expect(products.length).toBeGreaterThan(0);

  return products[0];
};

export const formatMoney = (amount: number): string => `$${amount.toFixed(2)}`;

export const formatProductPrice = (product: Pick<ProductDto, 'price'>): string => formatMoney(product.price);

export const formatProductStock = (product: Pick<ProductDto, 'stockQuantity'>): string =>
  product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of stock';
