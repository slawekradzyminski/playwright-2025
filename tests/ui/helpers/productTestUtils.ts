import type { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';
import { createProduct } from '../../../http/products/createProductRequest';
import { getCart } from '../../../http/cart/getCartRequest';
import { clearCart } from '../../../http/cart/clearCartRequest';
import { generateProduct } from '../../../generators/productGenerator';
import type { ProductCreateDto, ProductDto } from '../../../types/products';
import type { CartDto } from '../../../types/cart';

export interface TestProduct {
  data: ProductCreateDto;
  created: ProductDto;
}

export const createTestProduct = async (
  request: APIRequestContext,
  token: string,
  overrides?: Partial<ProductCreateDto>
): Promise<TestProduct> => {
  const productData = generateProduct(overrides);
  const response = await createProduct(request, productData, token);
  expect(response.status()).toBe(201);
  const created: ProductDto = await response.json();

  return { data: productData, created };
};

export const assertCartState = async (
  request: APIRequestContext,
  token: string,
  expectedTotalItems: number
): Promise<CartDto> => {
  const response = await getCart(request, token);
  expect(response.status()).toBe(200);
  const cart: CartDto = await response.json();
  expect(cart.totalItems).toBe(expectedTotalItems);
  return cart;
};

export const resetCart = async (
  request: APIRequestContext,
  token: string
): Promise<void> => {
  const response = await clearCart(request, token);
  expect(response.status()).toBe(200);
};

