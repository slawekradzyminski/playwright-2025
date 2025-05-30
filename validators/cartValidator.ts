import { expect } from '@playwright/test';
import type { CartDto, CartItemDto } from '../types/cart';

export const validateCart = (cart: CartDto) => {
  expect(cart).toMatchObject({
    username: expect.any(String),
    items: expect.any(Array),
    totalPrice: expect.any(Number),
    totalItems: expect.any(Number),
  });
  
  expect(cart.username.length).toBeGreaterThan(0);
  expect(cart.totalPrice).toBeGreaterThanOrEqual(0);
  expect(cart.totalItems).toBeGreaterThanOrEqual(0);
  expect(cart.items.length).toBe(cart.totalItems);
  
  cart.items.forEach((item: CartItemDto, index) => {
    expect(item, `Cart item at index ${index}`).toMatchObject({
      productId: expect.any(Number),
      quantity: expect.any(Number),
    });
    
    expect(item.productId).toBeGreaterThan(0);
    expect(item.quantity).toBeGreaterThan(0);
  });
}; 