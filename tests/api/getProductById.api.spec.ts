import { test, expect } from '../../fixtures/apiAuthFixture';
import { createProduct } from '../../http/createProductRequest';
import { getProductById } from '../../http/getProductByIdRequest';
import { generateProduct } from '../../generators/productGenerator';
import type { ProductDto } from '../../types/products';
import { INVALID_TOKEN } from '../../config/constants';

test.describe('GET /api/products/{id} API tests', () => {
  test('client should retrieve product by id - 200', async ({ request, adminAuth, clientAuth }) => {
    // given
    const productData = generateProduct();
    const createResponse = await createProduct(request, productData, adminAuth.token);
    expect(createResponse.status()).toBe(201);
    const createdProduct: ProductDto = await createResponse.json();

    // when
    const response = await getProductById(request, createdProduct.id, clientAuth.token);

    // then
    expect(response.status()).toBe(200);
    const responseBody: ProductDto = await response.json();
    expect(responseBody.id).toBe(createdProduct.id);
    expect(responseBody.name).toBe(productData.name);
  });

  test('should return unauthorized for missing token - 401', async ({ request }) => {
    // when
    const response = await getProductById(request, 1);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return unauthorized for invalid token - 401', async ({ request }) => {
    // when
    const response = await getProductById(request, 1, INVALID_TOKEN);

    // then
    expect(response.status()).toBe(401);
  });

  test('should return not found for missing product - 404', async ({ request, adminAuth }) => {
    // when
    const response = await getProductById(request, 999999, adminAuth.token);

    // then
    expect(response.status()).toBe(404);
  });
});
