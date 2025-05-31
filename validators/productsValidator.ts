import { expect } from '@playwright/test';
import type { ProductDto } from '../types/product';

export function validateProductDto(product: any): asserts product is ProductDto {
  expect(typeof product.id).toBe('number');
  expect(typeof product.name).toBe('string');
  expect(typeof product.description).toBe('string');
  expect(typeof product.price).toBe('number');
  expect(typeof product.stockQuantity).toBe('number');
  expect(typeof product.category).toBe('string');
  expect(typeof product.imageUrl).toBe('string');
  expect(typeof product.createdAt).toBe('string');
  expect(typeof product.updatedAt).toBe('string');
} 