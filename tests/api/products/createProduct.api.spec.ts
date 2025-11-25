import { test, expect } from '../../../fixtures/apiAuthFixture';
import { createProduct } from '../../../http/products/createProductRequest';
import { generateProduct } from '../../../generators/productGenerator';
import type { ProductCreateDto, ProductDto } from '../../../types/products';
import { INVALID_TOKEN } from '../../../config/constants';
import { APIResponse } from '@playwright/test';

test.describe('POST /api/products API tests', () => {
  test('should successfully create a product with admin token - 201', async ({ request, adminAuth }) => {
    // given
    const productData: ProductCreateDto = generateProduct();

    // when
    const response = await createProduct(request, productData, adminAuth.token);

    // then
    expect(response.status()).toBe(201);
    await validateProductResponse(response, productData);
  });

  test('should successfully create a product with minimal data - 201', async ({ request, adminAuth }) => {
    // given
    const productData: ProductCreateDto = generateProduct({
      description: undefined,
      imageUrl: undefined
    });

    // when
    const response = await createProduct(request, productData, adminAuth.token);

    // then
    expect(response.status()).toBe(201);
    const responseBody: ProductDto = await response.json();
    expect(responseBody.name).toBe(productData.name);
    expect(responseBody.price).toBe(productData.price);
    expect(responseBody.stockQuantity).toBe(productData.stockQuantity);
    expect(responseBody.category).toBe(productData.category);
  });

  test('should return validation error for short name - 400', async ({ request, adminAuth }) => {
    // given
    const productData: ProductCreateDto = generateProduct({
      name: 'ab'
    });

    // when
    const response = await createProduct(request, productData, adminAuth.token);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return validation error for missing category - 400', async ({ request, adminAuth }) => {
    // given
    const productData = generateProduct({
      category: ''
    });

    // when
    const response = await createProduct(request, productData, adminAuth.token);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return validation error for negative price - 400', async ({ request, adminAuth }) => {
    // given
    const productData: ProductCreateDto = generateProduct({
      price: -10
    });

    // when
    const response = await createProduct(request, productData, adminAuth.token);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // given
    const productData: ProductCreateDto = generateProduct();

    // when
    const response = await createProduct(request, productData);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // given
    const productData: ProductCreateDto = generateProduct();

    // when
    const response = await createProduct(request, productData, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden for client user - 403', async ({ request, clientAuth }) => {
    // given
    const productData: ProductCreateDto = generateProduct();

    // when
    const response = await createProduct(request, productData, clientAuth.token);

    // then
    expect(response.status()).toBe(403);
  });
});

const validateProductResponse = async (response: APIResponse, productData: ProductCreateDto) => {
  const responseBody: ProductDto = await response.json();
  expect(responseBody.id).toBeDefined();
  expect(responseBody.name).toBe(productData.name);
  expect(responseBody.description).toBe(productData.description);
  expect(responseBody.price).toBe(productData.price);
  expect(responseBody.stockQuantity).toBe(productData.stockQuantity);
  expect(responseBody.category).toBe(productData.category);
  expect(responseBody.imageUrl).toBe(productData.imageUrl);
  expect(responseBody.createdAt).toBeDefined();
  expect(responseBody.updatedAt).toBeDefined();
};

