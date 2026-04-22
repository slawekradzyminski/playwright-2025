import { expect, test } from '../../../../fixtures/adminApiFixture';
import { randomAdminProductUpdate } from '../../../../generators/productGenerator';
import { expectErrorMessage, expectJsonResponse, expectUnauthorized } from '../../../../helpers/apiAssertions';
import { isValidProduct } from '../../../../helpers/productHelpers';
import type { ProductDto } from '../../../../types/product';

test.describe('PUT /api/v1/products/{id} admin API tests', () => {
  test('should update self-created product as admin - 200', async ({
    adminApiUser,
    adminProductsClient,
    createAdminProduct,
    trackAdminProductName
  }) => {
    // given
    const createdProduct = await createAdminProduct();
    const productUpdate = randomAdminProductUpdate();
    trackAdminProductName(productUpdate.name ?? createdProduct.name);

    // when
    const response = await adminProductsClient.updateProduct(createdProduct.id, productUpdate, adminApiUser.token);

    // then
    const responseBody = await expectJsonResponse<ProductDto>(response, 200);
    isValidProduct(responseBody);
    expect(responseBody.id).toBe(createdProduct.id);
    expect(responseBody).toMatchObject(productUpdate);
  });

  test('should return validation error for invalid product update body - 400', async ({
    adminApiUser,
    adminProductsClient,
    createAdminProduct
  }) => {
    // given
    const createdProduct = await createAdminProduct();
    const productUpdate = {
      stockQuantity: -1
    };

    // when
    const response = await adminProductsClient.updateProduct(createdProduct.id, productUpdate, adminApiUser.token);

    // then
    const responseBody = await expectJsonResponse<{ stockQuantity: string }>(response, 400);
    expect(responseBody.stockQuantity).toBe('Stock quantity cannot be negative');
  });

  test('should return unauthorized when token is missing - 401', async ({
    adminProductsClient,
    createAdminProduct
  }) => {
    // given
    const createdProduct = await createAdminProduct();
    const productUpdate = randomAdminProductUpdate();

    // when
    const response = await adminProductsClient.updateProduct(createdProduct.id, productUpdate);

    // then
    await expectUnauthorized(response);
  });

  test('should return forbidden when client user updates product - 403', async ({
    adminProductsClient,
    clientApiUser,
    createAdminProduct
  }) => {
    // given
    const createdProduct = await createAdminProduct();
    const productUpdate = randomAdminProductUpdate();

    // when
    const response = await adminProductsClient.updateProduct(createdProduct.id, productUpdate, clientApiUser.token);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found when product does not exist - 404', async ({ adminApiUser, adminProductsClient }) => {
    // given
    const missingProductId = 999999;
    const productUpdate = randomAdminProductUpdate();

    // when
    const response = await adminProductsClient.updateProduct(missingProductId, productUpdate, adminApiUser.token);

    // then
    await expectErrorMessage(response, 404, 'Product not found');
  });
});
