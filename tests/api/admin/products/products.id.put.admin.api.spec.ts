import { expect, test } from '../../../../fixtures/adminApiFixture';
import { randomAdminProductUpdate } from '../../../../generators/productGenerator';
import { expectJsonResponse } from '../../../../helpers/apiAssertions';
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
});
