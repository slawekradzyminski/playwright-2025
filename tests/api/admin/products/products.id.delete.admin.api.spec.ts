import { expect, test } from '../../../../fixtures/adminApiFixture';
import { expectUnauthorized } from '../../../../helpers/apiAssertions';

test.describe('DELETE /api/v1/products/{id} admin API tests', () => {
  test('should delete self-created product as admin - 204', async ({
    adminApiUser,
    adminProductsClient,
    createAdminProduct
  }) => {
    // given
    const createdProduct = await createAdminProduct();

    // when
    const response = await adminProductsClient.deleteProduct(createdProduct.id, adminApiUser.token);

    // then
    expect(response.status()).toBe(204);

    // when
    const getDeletedProductResponse = await adminProductsClient.getProductById(createdProduct.id, adminApiUser.token);

    // then
    expect(getDeletedProductResponse.status()).toBe(404);
  });

  test('should return unauthorized when token is missing - 401', async ({
    adminProductsClient,
    createAdminProduct
  }) => {
    // given
    const createdProduct = await createAdminProduct();

    // when
    const response = await adminProductsClient.deleteProduct(createdProduct.id);

    // then
    await expectUnauthorized(response);
  });

  test('should return forbidden when client user deletes product - 403', async ({
    adminProductsClient,
    clientApiUser,
    createAdminProduct
  }) => {
    // given
    const createdProduct = await createAdminProduct();

    // when
    const response = await adminProductsClient.deleteProduct(createdProduct.id, clientApiUser.token);

    // then
    expect(response.status()).toBe(403);
  });

  test('should return not found when product does not exist - 404', async ({ adminApiUser, adminProductsClient }) => {
    // given
    const missingProductId = 999999;

    // when
    const response = await adminProductsClient.deleteProduct(missingProductId, adminApiUser.token);

    // then
    expect(response.status()).toBe(404);
  });
});
