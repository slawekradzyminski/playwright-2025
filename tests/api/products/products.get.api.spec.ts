import { expect, test } from '../../../fixtures/authenticatedUserFixture';
import { expectInvalidToken, expectJsonResponse, expectUnauthorized } from '../../../helpers/apiAssertions';
import { isValidProduct } from '../../../helpers/productHelpers';
import { INVALID_TOKEN } from '../../../httpclients/baseApiClient';
import { ProductsClient } from '../../../httpclients/productsClient';
import type { ProductDto } from '../../../types/product';

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
    const responseBody = await expectJsonResponse<ProductDto[]>(response, 200);
    expect(Array.isArray(responseBody)).toBe(true);
    expect(responseBody.length).toBeGreaterThan(0);

    for (const product of responseBody) {
      isValidProduct(product);
    }
  });

  test('should return unauthorized when token is missing - 401', async () => {
    // given

    // when
    const response = await productsClient.getProducts();

    // then
    await expectUnauthorized(response);
  });

  test('should return unauthorized when token is invalid - 401', async () => {
    // given

    // when
    const response = await productsClient.getProducts(INVALID_TOKEN);

    // then
    await expectInvalidToken(response);
  });
});
