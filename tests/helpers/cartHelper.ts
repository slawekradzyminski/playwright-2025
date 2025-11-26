import type { APIRequestContext } from '@playwright/test';
import { expect } from '@playwright/test';
import { addCartItem } from '../../http/cart/addCartItemRequest';
import { getCart } from '../../http/cart/getCartRequest';
import { clearCart } from '../../http/cart/clearCartRequest';
import type { CartDto, CartItemDto } from '../../types/cart';

export const buildCartItem = (productId: number, quantity = 1): CartItemDto => ({
  productId,
  quantity
});

export const addToCart = async (
  request: APIRequestContext,
  productId: number,
  token: string,
  quantity = 1
): Promise<CartDto> => {
  const response = await addCartItem(request, buildCartItem(productId, quantity), token);
  expect(response.status()).toBe(200);
  return response.json();
};

export const resetCart = async (
  request: APIRequestContext,
  token: string
): Promise<void> => {
  const response = await clearCart(request, token);
  expect(response.status()).toBe(200);
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

export const assertCartEmpty = async (
  request: APIRequestContext,
  token: string
): Promise<void> => {
  await assertCartState(request, token, 0);
};

