import { test } from '../../../fixtures/adminUiFixture';
import { AdminProductsPage } from '../../../pages/admin/adminProductsPage';

test.describe('Admin product list UI tests', () => {
  let adminProductsPage: AdminProductsPage;

  test.beforeEach(async ({ page }) => {
    adminProductsPage = new AdminProductsPage(page);
  });

  test('should display admin product list', async () => {
    // when
    await adminProductsPage.open();

    // then
    await adminProductsPage.assertThatUrlIs(AdminProductsPage.url);
    await adminProductsPage.assertThatProductListIsVisible();
  });

  test('should keep product when delete confirmation is dismissed', async ({ createAdminProduct }) => {
    // given
    const createdProduct = await createAdminProduct();
    await adminProductsPage.open();
    await adminProductsPage.assertThatProductIsVisible(createdProduct);

    // when
    await adminProductsPage.cancelDeleteProduct(createdProduct.id);

    // then
    await adminProductsPage.assertThatProductIsVisible(createdProduct);
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
