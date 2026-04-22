import { expect, test } from '../../../../fixtures/adminApiFixture';

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
});
