import { expect, test } from '../../../../fixtures/adminApiFixture';
import { randomAdminProduct } from '../../../../generators/productGenerator';
import { expectJsonResponse } from '../../../../helpers/apiAssertions';
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
});
