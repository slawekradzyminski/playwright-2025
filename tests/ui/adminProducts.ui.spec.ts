import { test } from '@playwright/test';
import { AdminProductsPage } from '../../pages/adminProductsPage';

test.describe('Admin Products UI tests', () => {
  let adminProductsPage: AdminProductsPage;

  test.beforeEach(async ({ page }) => {
    adminProductsPage = new AdminProductsPage(page);
    await adminProductsPage.goto();
  });

  test('should display products table with all products', async () => {
    await adminProductsPage.expectToBeOnProductsPage();
    await adminProductsPage.expectProductsTableVisible();
    await adminProductsPage.expectTableHeaders();
  });

  test('should have Add New Product button', async () => {
    await adminProductsPage.expectToBeOnProductsPage();
    await adminProductsPage.expectAddNewProductButtonVisible();
  });
});
