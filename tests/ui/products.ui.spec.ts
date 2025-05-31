import { test } from '../../fixtures/ui.auth.fixture';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('Products UI tests', () => {
  test('should display all page elements', async ({ loggedInPage }) => {
    // given
    const productsPage = new ProductsPage(loggedInPage);
    
    // when
    await productsPage.goto();

    // then
    await productsPage.expectPageElements();
  });

  test('should display all category buttons', async ({ loggedInPage }) => {
    // given
    const productsPage = new ProductsPage(loggedInPage);
    
    // when
    await productsPage.goto();

    // then
    await productsPage.expectAllCategoryButtons();
  });

  test('should display products grid', async ({ loggedInPage }) => {
    // given
    const productsPage = new ProductsPage(loggedInPage);
    
    // when
    await productsPage.goto();

    // then
    await productsPage.expectProductsToBeDisplayed();
  });

  test('should filter products by Electronics category', async ({ loggedInPage }) => {
    // given
    const productsPage = new ProductsPage(loggedInPage);
    await productsPage.goto();

    // when
    await productsPage.clickCategory('Electronics');

    // then
    await productsPage.expectCategoryProducts('Electronics');
  });

  test('should search for products and show results', async ({ loggedInPage }) => {
    // given
    const productsPage = new ProductsPage(loggedInPage);
    await productsPage.goto();

    // when
    await productsPage.searchForProduct('iPhone');

    // then
    await productsPage.expectSearchResults('iPhone');
    await productsPage.expectClearSearchButtonVisible();
  });

  test('should clear search and show all products', async ({ loggedInPage }) => {
    // given
    const productsPage = new ProductsPage(loggedInPage);
    await productsPage.goto();
    await productsPage.searchForProduct('iPhone');

    // when
    await productsPage.clearSearch();

    // then
    await productsPage.expectClearSearchButtonHidden();
    await productsPage.expectCategoryProducts('All');
  });
}); 