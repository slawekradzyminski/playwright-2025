import { expect } from '@playwright/test';
import { CartClient } from '../httpclients/cartClient';
import type { CartDto, CartItemDto } from '../types/cart';

export const MISSING_PRODUCT_ID = 999999;

export const expectCartContainsItem = (
  cart: CartDto,
  expectedItem: CartItemDto,
  expectedUsername: string
): void => {
  expect(cart.username).toBe(expectedUsername);

  const cartItem = cart.items.find(item => item.productId === expectedItem.productId);
  expect(cartItem).toBeDefined();
  expect(cartItem!.quantity).toBe(expectedItem.quantity);
  expect(cart.totalItems).toBeGreaterThanOrEqual(expectedItem.quantity);
  expect(cart.totalPrice).toEqual(expect.any(Number));
};

export const expectCartDoesNotContainProduct = (
  cart: CartDto,
  productId: number,
  expectedUsername: string
): void => {
  expect(cart.username).toBe(expectedUsername);
  expect(cart.items.some(item => item.productId === productId)).toBe(false);
  expect(cart.totalItems).toEqual(expect.any(Number));
  expect(cart.totalPrice).toEqual(expect.any(Number));
};

export const givenCartWithProduct = async (
  cartClient: CartClient,
  token: string,
  cartItem: CartItemDto
): Promise<CartDto> => {
  const clearResponse = await cartClient.clearCart(token);
  expect(clearResponse.status()).toBe(204);

  const addResponse = await cartClient.addItem(cartItem, token);
  expect(addResponse.status()).toBe(200);

  return addResponse.json();
};
