import { test, expect } from '../../fixtures/apiAuthFixture';
import type { ProductCreateDto, ProductDto } from '../../types/product';
import { generateProduct, generateProductWithInvalidName, generateProductWithInvalidPrice } from '../../generators/productGenerator';
import { createProduct } from '../../http/productsClient';
import { APIResponse } from '@playwright/test';

test.describe('POST /api/products API tests', () => {
  test('should successfully create product with valid data for admin - 201', async ({ request, authenticatedAdmin }) => {
    // given
    const productData = generateProduct();

    // when
    const response = await createProduct(request, productData, authenticatedAdmin.token);

    // then
    expect(response.status()).toBe(201);
    await validateProductResponse(response, productData);
  });

  test('should return bad request for product with invalid name (too short) - 400', async ({ request, authenticatedAdmin }) => {
    // given
    const productData = generateProductWithInvalidName();

    // when
    const response = await createProduct(request, productData, authenticatedAdmin.token);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return bad request for product with invalid price (negative) - 400', async ({ request, authenticatedAdmin }) => {
    // given
    const productData = generateProductWithInvalidPrice();

    // when
    const response = await createProduct(request, productData, authenticatedAdmin.token);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given
    const productData = generateProduct();

    // when
    const response = await createProduct(request, productData);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden error for client - 403', async ({ request, authenticatedClient }) => {
    // given
    const productData = generateProduct();

    // when
    const response = await createProduct(request, productData, authenticatedClient.token);

    // then
    expect(response.status()).toBe(403);
  });
});

const validateProductResponse = async (response: APIResponse, productData: ProductCreateDto): Promise<ProductDto> => {
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
  return responseBody;
};
