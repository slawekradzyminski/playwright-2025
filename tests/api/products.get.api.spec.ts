import { ProductsClient } from '../../httpclients/productsClient';
import type { ProductDto } from '../../types/product';
import { expect, test } from '../../fixtures/authenticatedUserFixture';

test.describe('GET /api/v1/products API tests', () => {
  test('should return all products for authenticated user - 200', async ({ request, authenticatedUser }) => {
    // given
    const productsClient = new ProductsClient(request);

    // when
    const response = await productsClient.getProducts(authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);

    const responseBody: ProductDto[] = await response.json();
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);

    for (const product of responseBody) {
      isValidProduct(product)
    }
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // given
    const productsClient = new ProductsClient(request);

    // when
    const response = await productsClient.getProducts();

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async ({ request }) => {
    // given
    const productsClient = new ProductsClient(request);

    // when
    const response = await productsClient.getProducts('invalid-token');

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});

export const isValidProduct = (product: ProductDto) => {
  expect(product.id).toEqual(expect.any(Number));
  expect(product.name).toEqual(expect.any(String));
  expect(product.description).toEqual(expect.any(String));
  expect(product.price).toEqual(expect.any(Number));
  expect(product.stockQuantity).toEqual(expect.any(Number));
  expect(product.category).toEqual(expect.any(String));
  expect(product.imageUrl).toEqual(expect.any(String));
  expect(product.createdAt).toEqual(expect.any(String));
  expect(product.updatedAt).toEqual(expect.any(String));
}