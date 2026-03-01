import { test, expect } from '../fixtures/ui-auth.fixture';
import { PRODUCTS_URL } from './constants/ui.urls.constants';
import { PRODUCTS_UI_TEXT } from './constants/products.ui.constants';
import { ProductDetailsPage } from './pages/product-details.page';
import { ProductsPage } from './pages/products.page';

test.describe('Product Details UI tests', () => {
  let productsPage: ProductsPage;
  let productDetailsPage: ProductDetailsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    productsPage = new ProductsPage(authenticatedPage);
    productDetailsPage = new ProductDetailsPage(authenticatedPage);
    await productsPage.goto();
    await expect(authenticatedPage).toHaveURL(PRODUCTS_URL);
    await productsPage.openFirstProductCard();
    await expect(authenticatedPage).toHaveURL(/\/products\/\d+$/);
  });

  test('should update quantity and button state on product details page', async () => {
    // given
    await expect(productDetailsPage.container).toBeVisible();
    await expect(productDetailsPage.quantityValue).toHaveText('1');
    await expect(productDetailsPage.addToCartButton).toBeEnabled();

    // when
    await productDetailsPage.decreaseQuantityButton.click();

    // then
    await expect(productDetailsPage.quantityValue).toHaveText('0');
    await expect(productDetailsPage.addToCartButton).toBeDisabled();

    // when
    await productDetailsPage.increaseQuantityButton.click();

    // then
    await expect(productDetailsPage.quantityValue).toHaveText('1');
    await expect(productDetailsPage.addToCartButton).toBeEnabled();
  });

  test('should navigate back to products page from product details page', async ({
    authenticatedPage,
  }) => {
    // given
    await expect(productDetailsPage.container).toBeVisible();

    // when
    await productDetailsPage.goBackToProducts();

    // then
    await expect(authenticatedPage).toHaveURL(PRODUCTS_URL);
    await expect(productsPage.title).toHaveText(PRODUCTS_UI_TEXT.pageTitle);
  });
});
