import { test } from '@playwright/test';
import { ProductsPage } from '../../pages/productsPage';
import { ProductDetailsPage } from '../../pages/productDetailsPage';

test.describe('Product details UI tests', () => {
  let productsPage: ProductsPage;
  let productDetailsPage: ProductDetailsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    productDetailsPage = new ProductDetailsPage(page);

    await productsPage.goto();
    await productsPage.expectProductListVisible();
    await productsPage.openFirstProductDetails();
    await productDetailsPage.expectToBeOnProductDetailsPage();
  });

  test('should display product details and stock information', async () => {
    await productDetailsPage.expectProductDetailsVisible();
  });

  test('should allow updating quantity and updating the cart', async () => {
    const initialQuantity = await productDetailsPage.readQuantityValue();

    await productDetailsPage.increaseQuantity();
    await productDetailsPage.expectQuantityValue(initialQuantity + 1);

    await productDetailsPage.decreaseQuantity();
    await productDetailsPage.expectQuantityValue(initialQuantity);

    await productDetailsPage.updateCart();
  });
});
