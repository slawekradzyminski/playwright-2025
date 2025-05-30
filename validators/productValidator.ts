import { expect } from '@playwright/test';
import type { ProductDto } from '../types/products';

export const validateProductsArray = (products: ProductDto[]) => {
  expect(Array.isArray(products)).toBe(true);
  expect(products.length).toBeGreaterThan(0);
  
  products.forEach((product, index) => {
    expect(product, `Product at index ${index}`).toMatchObject({
      id: expect.any(Number),
      name: expect.any(String),
      description: expect.any(String),
      price: expect.any(Number),
      stockQuantity: expect.any(Number),
      category: expect.any(String),
      imageUrl: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
    });
    
    expect(product.id).toBeGreaterThan(0);
    expect(product.name.length).toBeGreaterThan(0);
    expect(product.price).toBeGreaterThanOrEqual(0);
    expect(product.stockQuantity).toBeGreaterThanOrEqual(0);
  });
};
