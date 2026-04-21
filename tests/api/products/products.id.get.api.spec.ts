import { expect, test } from '../../../fixtures/authenticatedUserFixture';
import { expectInvalidToken, expectJsonResponse, expectUnauthorized } from '../../../helpers/apiAssertions';
import { isValidProduct } from '../../../helpers/productHelpers';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { ProductsClient } from '../../../httpclients/productsClient';
import type { ProductDto } from '../../../types/product';

test.describe('GET /api/v1/products/{id} API tests', () => {
  let productsClient: ProductsClient;

  test.beforeEach(async ({ request }) => {
    productsClient = new ProductsClient(request);
  });

  test('should return product by id for authenticated user - 200', async ({ authenticatedUser }) => {
    // given
    const productsResponse = await productsClient.getProducts(authenticatedUser.token);
    const products = await expectJsonResponse<ProductDto[]>(productsResponse, 200);
    expect(products.length).toBeGreaterThan(0);
    const existingProduct = products[0];

    // when
    const response = await productsClient.getProductById(existingProduct.id, authenticatedUser.token);

    // then
    const responseBody = await expectJsonResponse<ProductDto>(response, 200);
    expect(responseBody.id).toBe(existingProduct.id);
    isValidProduct(responseBody);
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await productsClient.getProductById(1);

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await productsClient.getProductById(1, INVALID_TOKEN);

    // then
    await expectInvalidToken(response);
  });

  test('should return not found when product does not exist - 404', async ({ authenticatedUser }) => {
    // given
    const missingProductId = 999999;

    // when
    const response = await productsClient.getProductById(missingProductId, authenticatedUser.token);

    // then
    expect(response.status()).toBe(404);
  });
});
