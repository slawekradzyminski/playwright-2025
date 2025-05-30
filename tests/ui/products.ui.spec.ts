import { test, expect } from '../../fixtures/ui.fixtures';
import { ProductsPage } from '../../pages/ProductsPage';

test.describe('Products UI tests', () => {
  let productsPage: ProductsPage;

  test.beforeEach(async ({ loggedInPage }) => {
    productsPage = new ProductsPage(loggedInPage);
    await productsPage.goto();
    await productsPage.expectToBeOnProductsPage();
  });

  test('should display all products by default', async () => {
    // given
    // when
    // then
    await productsPage.expectCategoryHeading('All Products');
    await productsPage.expectProductsToBeDisplayed(8);
  });

  test('should filter products by Electronics category', async () => {
    // given
    // when
    await productsPage.selectCategory('electronics');

    // then
    await productsPage.expectCategoryHeading('Electronics Products');
    await productsPage.expectProductToBeVisible('iPhone 13 Pro');
    await productsPage.expectProductToBeVisible('Samsung Galaxy S21');
    await productsPage.expectProductNotToBeVisible('MacBook Pro 14');
    await productsPage.expectProductsToBeDisplayed(2);
  });

  test('should filter products by Books category', async () => {
    // given
    // when
    await productsPage.selectCategory('books');

    // then
    await productsPage.expectCategoryHeading('Books Products');
    await productsPage.expectProductToBeVisible('Clean Code');
    await productsPage.expectProductNotToBeVisible('iPhone 13 Pro');
    await productsPage.expectProductsToBeDisplayed(1);
  });

  test('should search for products by name', async () => {
    // given
    // when
    await productsPage.searchForProduct('iPhone');

    // then
    await productsPage.expectClearSearchButtonToBeVisible();
    await productsPage.expectProductToBeVisible('iPhone 13 Pro');
    await productsPage.expectProductNotToBeVisible('Samsung Galaxy S21');
    await productsPage.expectProductsToBeDisplayed(1);
  });

  test('should clear search and show all products', async () => {
    // given
    await productsPage.searchForProduct('iPhone');
    await productsPage.expectProductsToBeDisplayed(1);

    // when
    await productsPage.clearSearch();

    // then
    await productsPage.expectProductsToBeDisplayed(8);
    await productsPage.expectProductToBeVisible('iPhone 13 Pro');
    await productsPage.expectProductToBeVisible('Samsung Galaxy S21');
  });

  test('should sort products by price from low to high', async () => {
    // given
    // when
    await productsPage.sortBy('Price (Low to High)');

    // then
    await productsPage.expectSortValue('price-asc');
    await productsPage.expectFirstProductToBe('Clean Code');
  });

  test('should sort products by price from high to low', async () => {
    // given
    // when
    await productsPage.sortBy('Price (High to Low)');

    // then
    await productsPage.expectSortValue('price-desc');
    await productsPage.expectFirstProductToBe('MacBook Pro 14');
  });

  test('should sort products by name A-Z', async () => {
    // given
    // when
    await productsPage.sortBy('Name (A-Z)');

    // then
    await productsPage.expectSortValue('name-asc');
    await productsPage.expectFirstProductToBe('Apple Watch Series 7');
  });

  test('should sort products by name Z-A', async () => {
    // given
    // when
    await productsPage.sortBy('Name (Z-A)');

    // then
    await productsPage.expectSortValue('name-desc');
    await productsPage.expectFirstProductToBe('Sony WH-1000XM4');
  });

  test('should increase and decrease product quantity', async () => {
    // given
    const productName = 'iPhone 13 Pro';

    // when
    await productsPage.increaseQuantity(productName);

    // then
    await productsPage.expectQuantity(productName, '2');

    // when
    await productsPage.decreaseQuantity(productName);

    // then
    await productsPage.expectQuantity(productName, '1');
  });

  test('should add product to cart and show notification', async () => {
    // given
    const productName = 'Samsung Galaxy S21';
    
    // when
    await productsPage.addToCart(productName);

    // then
    await productsPage.expectAddToCartNotification(productName, '1');
    // await productsPage.expectCartItemCount('1');
    await productsPage.expectProductInCartStatus(productName, '1');
  });

  test('should add multiple quantities to cart', async () => {
    // given
    const productName = 'PlayStation 5';
    await productsPage.increaseQuantity(productName);
    await productsPage.increaseQuantity(productName);

    // when
    await productsPage.addToCart(productName);

    // then
    await productsPage.expectAddToCartNotification(productName, '3');
    // await productsPage.expectCartItemCount('3');
    await productsPage.expectProductInCartStatus(productName, '3');
  });

  test('should work with category filtering and search together', async () => {
    // given
    await productsPage.selectCategory('electronics');
    await productsPage.expectProductsToBeDisplayed(2);

    // when
    await productsPage.searchForProduct('Samsung');

    // then
    await productsPage.expectProductToBeVisible('Samsung Galaxy S21');
    await productsPage.expectProductNotToBeVisible('iPhone 13 Pro');
    await productsPage.expectProductsToBeDisplayed(1);
  });
});
