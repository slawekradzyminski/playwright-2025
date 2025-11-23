import { test, expect } from '../../../fixtures/apiAuthFixture';
import type { ProductCreateDto, ProductDto } from '../../../types/product';
import { createProduct, createProductWithoutAuth } from '../../../http/products/createProductRequest';
import { generateRandomProduct, generateRandomProductWithoutOptionalFields } from '../../../generators/productGenerator';

test.describe('POST /api/products API tests', () => {
  test('should successfully create product with all fields as admin - 201', async ({ request, authenticatedAdminUser }) => {
    // given
    const { token } = authenticatedAdminUser;
    const productData: ProductCreateDto = generateRandomProduct();

    // when
    const response = await createProduct(request, token, productData);
    
    // then
    expect(response.status()).toBe(201);
    const responseBody: ProductDto = await response.json();
    expect(responseBody.name).toBe(productData.name);
    expect(responseBody.description).toBe(productData.description);
    expect(responseBody.price).toBe(productData.price);
    expect(responseBody.stockQuantity).toBe(productData.stockQuantity);
    expect(responseBody.category).toBe(productData.category);
    expect(responseBody.imageUrl).toBe(productData.imageUrl);
    expect(responseBody.id).toBeDefined();
    expect(responseBody.createdAt).toBeDefined();
    expect(responseBody.updatedAt).toBeDefined();
  });

  test('should successfully create product with only required fields as admin - 201', async ({ request, authenticatedAdminUser }) => {
    // given
    const { token } = authenticatedAdminUser;
    const productData: ProductCreateDto = generateRandomProductWithoutOptionalFields();

    // when
    const response = await createProduct(request, token, productData);
    
    // then
    expect(response.status()).toBe(201);
    const responseBody: ProductDto = await response.json();
    expect(responseBody.name).toBe(productData.name);
    expect(responseBody.price).toBe(productData.price);
    expect(responseBody.stockQuantity).toBe(productData.stockQuantity);
    expect(responseBody.category).toBe(productData.category);
    expect(responseBody.id).toBeDefined();
  });

  test('should return validation error for invalid product name - 400', async ({ request, authenticatedAdminUser }) => {
    // given
    const { token } = authenticatedAdminUser;
    const productData: ProductCreateDto = {
      ...generateRandomProduct(),
      name: 'ab'
    };

    // when
    const response = await createProduct(request, token, productData);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized error when no token provided - 401', async ({ request }) => {
    // given
    const productData: ProductCreateDto = generateRandomProduct();

    // when
    const response = await createProductWithoutAuth(request, productData);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized error with invalid token - 401', async ({ request }) => {
    // given
    const invalidToken = 'invalid.token.here';
    const productData: ProductCreateDto = generateRandomProduct();

    // when
    const response = await createProduct(request, invalidToken, productData);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden error when client user tries to create product - 403', async ({ request, authenticatedClientUser }) => {
    // given
    const { token } = authenticatedClientUser;
    const productData: ProductCreateDto = generateRandomProduct();

    // when
    const response = await createProduct(request, token, productData);

    // then
    expect(response.status()).toBe(403);
  });
});

