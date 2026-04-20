import { ProductsClient } from '../../httpclients/productsClient';
import type { ProductDto } from '../../types/product';
import { expect, test } from '../../fixtures/authenticatedUserFixture';
import { isValidProduct } from '../../helpers/productHelpers';

test.describe('GET /api/v1/products/{id} API tests', () => {
  test('should return product by id for authenticated user - 200', async ({ request, authenticatedUser }) => {
    // given
    const productsClient = new ProductsClient(request);
    const productsResponse = await productsClient.getProducts(authenticatedUser.token);
    expect(productsResponse.status()).toBe(200);

    const products: ProductDto[] = await productsResponse.json();
    expect(products.length).toBeGreaterThan(0);
    const existingProduct = products[0];

    // when
    const response = await productsClient.getProductById(existingProduct.id, authenticatedUser.token);

    // then
    expect(response.status()).toBe(200);

    const responseBody: ProductDto = await response.json();
    expect(responseBody.id).toBe(existingProduct.id);
    isValidProduct(responseBody);
  });

  test('should return unauthorized when token is missing - 401', async ({ request }) => {
    // given
    const productsClient = new ProductsClient(request);

    // when
    const response = await productsClient.getProductById(1);

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Unauthorized');
  });

  test('should return unauthorized when token is invalid - 401', async ({ request }) => {
    // given
    const productsClient = new ProductsClient(request);

    // when
    const response = await productsClient.getProductById(1, 'invalid-token');

    // then
    expect(response.status()).toBe(401);
    const responseBody = await response.json();
    expect(responseBody.message).toBe('Invalid or expired token');
  });

  test('should return not found when product does not exist - 404', async ({ request, authenticatedUser }) => {
    // given
    const productsClient = new ProductsClient(request);
    const missingProductId = 999999;

    // when
    const response = await productsClient.getProductById(missingProductId, authenticatedUser.token);

    // then
    expect(response.status()).toBe(404);
  });
});
