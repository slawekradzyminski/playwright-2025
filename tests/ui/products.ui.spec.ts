import { test, expect } from '../fixtures/ui-auth.fixture';
import { PRODUCTS_URL } from './constants/ui.urls.constants';
import { PRODUCTS_UI_TEXT } from './constants/products.ui.constants';
import { ProductDetailsPage } from './pages/product-details.page';
import { ProductsPage } from './pages/products.page';
import { arePricesSortedDescending } from './utils/product-sort.util';

test.describe('Products Catalog UI tests', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ authenticatedPage }) => {
    productsPage = new ProductsPage(authenticatedPage);
    await productsPage.goto();
    await expect(authenticatedPage).toHaveURL(PRODUCTS_URL);
    await expect(productsPage.title).toHaveText(PRODUCTS_UI_TEXT.pageTitle);
  });

  test('should render product catalog controls and list', async () => {
    // given
    // page is opened in beforeEach

    // when
    // no action

    // then
    await expect(productsPage.container).toBeVisible();
    await expect(productsPage.categoriesTitle).toHaveText(PRODUCTS_UI_TEXT.categoriesTitle);
    await expect(productsPage.productSearchInput).toBeVisible();
    await expect(productsPage.productSortSelect).toBeVisible();
    expect(await productsPage.productItems.count()).toBeGreaterThan(0);
  });

  test('should sort products by price descending', async () => {
    // given
    // page is opened in beforeEach

    // when
    await productsPage.productSortSelect.selectOption('Price (High to Low)');

    // then
    const productPriceTexts = await productsPage.productPrices.allTextContents();
    expect(productPriceTexts.length).toBeGreaterThan(1);
    expect(arePricesSortedDescending(productPriceTexts)).toBe(true);
  });

  test('should navigate to product details when clicking a product card', async ({
    authenticatedPage,
  }) => {
    // given
    const productDetailsPage = new ProductDetailsPage(authenticatedPage);
    const selectedProductName = await productsPage.productNames.first().innerText();

    // when
    await productsPage.openFirstProductCard();

    // then
    await expect(authenticatedPage).toHaveURL(/\/products\/\d+$/);
    await expect(productDetailsPage.container).toBeVisible();
    await expect(productDetailsPage.title).toHaveText(selectedProductName);
  });
});
