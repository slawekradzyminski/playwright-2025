import { test } from '@playwright/test';
import { ProductsPage } from '../../pages/productsPage';

test.describe('Products UI tests', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ page }) => {
    productsPage = new ProductsPage(page);
    await productsPage.goto();
  });

  test('should display products list and filters', async () => {
    await productsPage.expectToBeOnProductsPage();
    await productsPage.expectPageHeadingVisible();
    await productsPage.expectFiltersVisible();
    await productsPage.expectProductListVisible();
  });

  test('should allow searching, filtering, and sorting products', async () => {
    await productsPage.searchFor('Apple');
    await productsPage.expectSearchValue('Apple');
    await productsPage.selectCategory('Audio');
    await productsPage.expectProductListHeading('Audio Products');
    await productsPage.selectSortOption('Price (Low to High)');
  });

  test('should update quantity controls and add product to cart', async () => {
    await productsPage.expectProductListVisible();
    await productsPage.expectFirstProductQuantityValue('1');
    await productsPage.incrementQuantityForFirstProduct();
    await productsPage.expectFirstProductQuantityValue('2');
    await productsPage.decrementQuantityForFirstProduct();
    await productsPage.expectFirstProductQuantityValue('1');
    await productsPage.addFirstProductToCart();
  });
});
