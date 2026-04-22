import { expect, test } from '../../../../fixtures/adminApiFixture';
import { randomAdminProduct } from '../../../../generators/productGenerator';
import { expectJsonResponse, expectUnauthorized } from '../../../../helpers/apiAssertions';
import { isValidProduct } from '../../../../helpers/productHelpers';
import type { ProductDto } from '../../../../types/product';

test.describe('POST /api/v1/products admin API tests', () => {
  test('should create product as admin - 201', async ({
    adminApiUser,
    adminProductsClient,
    trackAdminProduct,
    trackAdminProductName
  }) => {
    // given
    const productData = randomAdminProduct();
    trackAdminProductName(productData.name);

    // when
    const response = await adminProductsClient.createProduct(productData, adminApiUser.token);

    // then
    const responseBody = await expectJsonResponse<ProductDto>(response, 201);
    trackAdminProduct(responseBody);
    isValidProduct(responseBody);
    expect(responseBody.name).toBe(productData.name);
    expect(responseBody.description).toBe(productData.description);
    expect(responseBody.price).toBe(productData.price);
    expect(responseBody.stockQuantity).toBe(productData.stockQuantity);
    expect(responseBody.category).toBe(productData.category);
    expect(responseBody.imageUrl).toBe(productData.imageUrl);
  });

  test('should return validation error for invalid product body - 400', async ({
    adminApiUser,
    adminProductsClient
  }) => {
    // given
    const productData = {
      ...randomAdminProduct(),
      description: ''
    };

    // when
    const response = await adminProductsClient.createProduct(productData, adminApiUser.token);

    // then
    const responseBody = await expectJsonResponse<{ description: string }>(response, 400);
    expect(responseBody.description).toBe('Product description is required');
  });

  test('should return unauthorized when token is missing - 401', async ({ adminProductsClient }) => {
    // given
    const productData = randomAdminProduct();

    // when
    const response = await adminProductsClient.createProduct(productData);

    // then
    await expectUnauthorized(response);
  });

  test('should return forbidden when client user creates product - 403', async ({
    adminProductsClient,
    clientApiUser
  }) => {
    // given
    const productData = randomAdminProduct();

    // when
    const response = await adminProductsClient.createProduct(productData, clientApiUser.token);

    // then
    expect(response.status()).toBe(403);
  });
});
