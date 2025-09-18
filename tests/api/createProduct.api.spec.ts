import { test, expect } from '../../fixtures/apiAuth';
import { createProduct, createProductNoAuth } from '../../http/createProductClient';
import { randomProduct, invalidProduct } from '../../generators/productGenerator';
import { ProductDto } from '../../types/product';

test.describe('/api/products POST API tests', () => {
  test('should successfully create product with admin token - 201', async ({ apiAuthAdmin }) => {
    // given
    const { request, token } = apiAuthAdmin;
    const productData = randomProduct();

    // when
    const response = await createProduct(request, productData, token);

    // then
    expect(response.status()).toBe(201);
    const responseBody = await response.json() as ProductDto;
    
    expect(responseBody).toHaveProperty('id');
    expect(responseBody.name).toBe(productData.name);
    expect(responseBody.description).toBe(productData.description);
    expect(responseBody.price).toBe(productData.price);
    expect(responseBody.stockQuantity).toBe(productData.stockQuantity);
    expect(responseBody.category).toBe(productData.category);
    expect(responseBody.imageUrl).toBe(productData.imageUrl);
    expect(responseBody).toHaveProperty('createdAt');
    expect(responseBody).toHaveProperty('updatedAt');
  });

  test('should return validation error for invalid product data - 400', async ({ apiAuthAdmin }) => {
    // given
    const { request, token } = apiAuthAdmin;
    const invalidProductData = invalidProduct();

    // when
    const response = await createProduct(request, invalidProductData as any, token);

    // then
    expect(response.status()).toBe(400);
  });

  test('should return unauthorized error without token - 401', async ({ request }) => {
    // given
    const productData = randomProduct();

    // when
    const response = await createProductNoAuth(request, productData);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return forbidden error with non-admin token - 403', async ({ apiAuth }) => {
    // given
    const { request, token } = apiAuth;
    const productData = randomProduct();

    // when
    const response = await createProduct(request, productData, token);

    // then
    expect(response.status()).toBe(403);
  });
});
