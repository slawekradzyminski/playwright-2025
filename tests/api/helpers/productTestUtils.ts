import { APIRequestContext, expect } from '@playwright/test';
import { getProducts } from '../../../http/productsClient';
import type { ProductDto } from '../../../types/product';

export const getExistingProductId = async (
  request: APIRequestContext,
  jwtToken: string
): Promise<number> => {
  const response = await getProducts(request, jwtToken);
  expect(response.status()).toBe(200);
  const products: ProductDto[] = await response.json();
  expect(products.length).toBeGreaterThan(0);
  return products[0].id;
};
