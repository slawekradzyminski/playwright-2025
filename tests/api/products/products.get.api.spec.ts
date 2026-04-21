import { ProductsClient } from '../../../httpclients/productsClient';
import type { ProductDto } from '../../../types/product';
import { expect, test } from '../../../fixtures/authenticatedUserFixture';
import { isValidProduct } from '../../../helpers/productHelpers';

test.describe('GET /api/v1/products API tests', () => {
  let productsClient: ProductsClient;

  test.beforeEach(async ({ request }) => {
    productsClient = new ProductsClient(request);
  });

  test('should return all products for authenticated user - 200', async ({ authenticatedUser }) => {
    // given

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

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await productsClient.getProducts();

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await productsClient.getProducts('invalid-token');

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });
});

