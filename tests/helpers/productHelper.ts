import type { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';
import { createProduct } from '../../http/products/createProductRequest';
import { generateProduct } from '../../generators/productGenerator';
import type { ProductCreateDto, ProductDto } from '../../types/products';

export interface TestProduct {
  data: ProductCreateDto;
  created: ProductDto;
}

export const createTestProduct = async (
  request: APIRequestContext,
  token: string,
  overrides?: Partial<ProductCreateDto>
): Promise<TestProduct> => {
  const data = generateProduct(overrides);
  const response = await createProduct(request, data, token);
  expect(response.status()).toBe(201);
  const created: ProductDto = await response.json();

  return { data, created };
};

