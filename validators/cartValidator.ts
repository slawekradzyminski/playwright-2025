import { expect } from '@playwright/test';
import type { CartDto, CartItemDto } from '../types/cart';

export function validateCartItemDto(item: any): asserts item is CartItemDto {
  expect(typeof item.productId).toBe('number');
  expect(typeof item.quantity).toBe('number');
}

export function validateCartDto(cart: any): asserts cart is CartDto {
  expect(typeof cart.username).toBe('string');
  expect(Array.isArray(cart.items)).toBe(true);
  expect(typeof cart.totalPrice).toBe('number');
  expect(typeof cart.totalItems).toBe('number');
  
  cart.items.forEach((item: any) => {
    validateCartItemDto(item);
  });
} 