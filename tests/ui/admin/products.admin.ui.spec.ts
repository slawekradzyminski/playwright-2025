import { expect, test } from '../../../fixtures/adminUiFixture';
import { randomAdminProduct, randomAdminProductUpdate } from '../../../generators/productGenerator';
import { expectJsonResponse } from '../../../helpers/apiAssertions';
import { AdminProductFormPage } from '../../../pages/admin/adminProductFormPage';
import { AdminProductsPage } from '../../../pages/admin/adminProductsPage';
import type { ProductDto } from '../../../types/product';

test.describe('Admin products UI tests', () => {
  let adminProductsPage: AdminProductsPage;
  let adminProductFormPage: AdminProductFormPage;

  test.beforeEach(async ({ page }) => {
    adminProductsPage = new AdminProductsPage(page);
    adminProductFormPage = new AdminProductFormPage(page);
  });

  test('should create product through admin UI', async ({
    adminProductsClient,
    adminApiUser,
    trackAdminProductName
  }) => {
    // given
    const productData = randomAdminProduct();
    trackAdminProductName(productData.name);
    await adminProductFormPage.openNew();
    await adminProductFormPage.assertThatCreateFormIsVisible();

    // when
    await adminProductFormPage.createProduct(productData);

    // then
    await adminProductsPage.open();
    await adminProductsPage.assertThatUrlIs(AdminProductsPage.url);
    await adminProductsPage.assertThatProductIsVisible(productData);

    const productsResponse = await adminProductsClient.getProducts(adminApiUser.token);
    const products = await expectJsonResponse<ProductDto[]>(productsResponse, 200);
    const createdProduct = products.find((product) => product.name === productData.name);
    expect(createdProduct).toBeDefined();
  });

  test('should update product through admin UI', async ({ createAdminProduct, trackAdminProductName }) => {
    // given
    const createdProduct = await createAdminProduct();
    const productUpdate = randomAdminProductUpdate();
    trackAdminProductName(productUpdate.name ?? createdProduct.name);
    await adminProductFormPage.openEdit(createdProduct.id);
    await adminProductFormPage.assertThatEditFormIsVisible();

    // when
    await adminProductFormPage.updateProduct(createdProduct.id, productUpdate);

    // then
    await adminProductsPage.open();
    await adminProductsPage.assertThatUrlIs(AdminProductsPage.url);
    await adminProductsPage.assertThatProductIsVisible({
      ...createdProduct,
      ...productUpdate
    });
  });

  test('should delete product through admin UI', async ({ createAdminProduct }) => {
    // given
    const createdProduct = await createAdminProduct();
    await adminProductsPage.open();
    await adminProductsPage.assertThatProductIsVisible(createdProduct);

    // when
    await adminProductsPage.deleteProduct(createdProduct.id);

    // then
    await adminProductsPage.assertThatProductIsNotVisible(createdProduct.name);
  });
});
